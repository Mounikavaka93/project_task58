import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { wait } from '../utils/wait';

export function useJobActions() {
  const { user, applyToJob, toggleSave, isSaved, isApplied } = useJobs();
  const navigate = useNavigate();
  const location = useLocation();
  const [busyId, setBusyId] = useState(null);
  const lock = useRef(new Set());

  const apply = async (jobId) => {
    if (!user) {
      navigate('/login', {
        state: {
          from: `/jobs/${jobId}`,
          message: 'Log in to apply for this role.',
        },
      });
      return;
    }
    if (lock.current.has(jobId)) return;
    lock.current.add(jobId);
    setBusyId(jobId);
    await wait(700);
    applyToJob(jobId);
    setBusyId(null);
    lock.current.delete(jobId);
  };

  const save = (jobId) => {
    if (!user) {
      navigate('/login', {
        state: {
          from: `${location.pathname}${location.search}`,
          message: 'Log in to save jobs to your shortlist.',
        },
      });
      return;
    }
    toggleSave(jobId);
  };

  return { apply, save, busyId, isSaved, isApplied, user };
}
