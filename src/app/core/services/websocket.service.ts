import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject, Observable, filter } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: Socket | null = null;
  private connected$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  /**
   * Connect to the WebSocket server
   */
  connect(token?: string): void {
    if (this.socket) {
      return;
    }

    this.socket = io(environment.socketUrl, {
      auth: {
        token: token
      },
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      randomizationFactor: 0.5
    });

    this.socket.on('connect', () => {
      this.connected$.next(true);
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', (reason) => {
      this.connected$.next(false);
      console.log('Disconnected from WebSocket server:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected$.next(false);
    }
  }

  /**
   * Emit an event to the server
   */
  emit(event: string, data: any): void {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  /**
   * Listen for an event from the server
   */
  on<T>(event: string): Observable<T> {
    return new Observable<T>(observer => {
      if (!this.socket) return;

      this.socket.on(event, (data: T) => {
        observer.next(data);
      });

      return () => {
        if (this.socket) {
          this.socket.off(event);
        }
      };
    });
  }

  /**
   * Join a room
   */
  joinRoom(roomId: string): void {
    this.emit('join-room', roomId);
  }

  /**
   * Leave a room
   */
  leaveRoom(roomId: string): void {
    this.emit('leave-room', roomId);
  }

  /**
   * Observable for connection status
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
