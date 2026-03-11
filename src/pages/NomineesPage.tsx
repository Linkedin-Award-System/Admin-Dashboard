import { Layout } from '@/shared/components/layout';
import { NomineeList } from '@/features/nominees';

export const NomineesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nominees</h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Manage nominees for each award category
          </p>
        </div>

        <NomineeList />
      </div>
    </Layout>
  );
};

export default NomineesPage;
