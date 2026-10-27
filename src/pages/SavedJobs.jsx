import { Link } from 'react-router-dom';
import AuthGate from '../components/AuthGate';
import EmptyState from '../components/EmptyState';
import JobCard from '../components/JobCard';
import PageContainer from '../components/PageContainer';
import PageHeader from '../components/PageHeader';
import { buttonClass } from '../components/Button';
import { getJob } from '../data/catalog';
import { useJobs } from '../context/JobContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function SavedJobs() {
  const { user } = useJobs();
  useDocumentTitle('Saved jobs');

  if (!user) {
    return <AuthGate title="Saved jobs" message="Log in to see the roles on your shortlist." />;
  }

  const saved = user.saved.map((id) => getJob(id)).filter(Boolean);

  return (
    <div>
      <PageHeader eyebrow="Shortlist" title="Saved jobs">
        Roles you bookmark stay here and on your dashboard. Remove one from the card when you are done with it.
      </PageHeader>
      <PageContainer className="py-8 lg:py-12">
        {saved.length ? (
          <div className="space-y-4">
            {saved.map((job) => (
              <JobCard key={job.id} job={job} variant="list" />
            ))}
          </div>
        ) : (
          <EmptyState title="Nothing saved yet">
            Browse the board and tap the bookmark on a role you want to revisit.
            <div className="mt-6">
              <Link to="/jobs" className={buttonClass('primary', 'h-12 px-6')}>
                Browse jobs
              </Link>
            </div>
          </EmptyState>
        )}
      </PageContainer>
    </div>
  );
}
