'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_ALL_NOTICES_BY_ADMIN,
  CREATE_NOTICE,
  UPDATE_NOTICE_BY_ADMIN,
  REMOVE_NOTICE_BY_ADMIN,
} from './admin-queries';
import type { NoticesByAdminResult, NoticeStatus, NoticeCategory } from './admin-types';

const STATUS_TABS: { key: NoticeStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'HOLD', label: 'Hold' },
  { key: 'DELETED', label: 'Deleted' },
];

const NOTICE_STATUSES: NoticeStatus[] = ['HOLD', 'ACTIVE', 'DELETED'];
const NOTICE_CATEGORIES: NoticeCategory[] = ['NOTICE', 'FAQ'];

const LIMIT = 20;

const statusBadge = (status: NoticeStatus) => {
  const map: Record<NoticeStatus, string> = {
    HOLD: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    DELETED: 'bg-slate-200 text-slate-600',
  };
  return map[status];
};

export const AdminCsPage = () => {
  const [statusTab, setStatusTab] = useState<NoticeStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [form, setForm] = useState({ noticeCategory: 'NOTICE' as NoticeCategory, noticeTitle: '', noticeContent: '' });

  const { data, loading, refetch } = useQuery<{ getAllNoticesByAdmin: NoticesByAdminResult }>(
    GET_ALL_NOTICES_BY_ADMIN,
    {
      variables: {
        input: {
          page,
          limit: LIMIT,
          search: {
            ...(statusTab !== 'ALL' ? { noticeStatus: statusTab } : {}),
          },
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const [createNotice, { loading: creating }] = useMutation(CREATE_NOTICE);
  const [updateNotice] = useMutation(UPDATE_NOTICE_BY_ADMIN);
  const [removeNotice] = useMutation(REMOVE_NOTICE_BY_ADMIN);

  const notices = data?.getAllNoticesByAdmin?.list ?? [];
  const totalCount = data?.getAllNoticesByAdmin?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  const handleTabChange = (tab: NoticeStatus | 'ALL') => {
    setStatusTab(tab);
    setPage(1);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.noticeTitle.trim().length < 3 || form.noticeContent.trim().length < 3) return;
    await createNotice({ variables: { input: form } });
    setForm({ noticeCategory: 'NOTICE', noticeTitle: '', noticeContent: '' });
    setPage(1);
    await refetch();
  };

  const handleChangeStatus = async (targetNoticeId: string, noticeStatus: NoticeStatus) => {
    await updateNotice({ variables: { input: { targetNoticeId, noticeStatus } } });
    await refetch();
  };

  const handleRemove = async (targetNoticeId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this notice?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#e11d48',
    });
    if (!result.isConfirmed) return;
    await removeNotice({ variables: { input: { targetNoticeId } } });
    await refetch();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal">Admin / CS</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Create Notice</h1>
        <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3">
          <div className="flex gap-3">
            <select
              value={form.noticeCategory}
              onChange={(e) => setForm((f) => ({ ...f, noticeCategory: e.target.value as NoticeCategory }))}
              className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {NOTICE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="text"
              placeholder="Notice title"
              value={form.noticeTitle}
              onChange={(e) => setForm((f) => ({ ...f, noticeTitle: e.target.value }))}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-teal"
              required
              minLength={3}
            />
          </div>
          <textarea
            placeholder="Notice content"
            value={form.noticeContent}
            onChange={(e) => setForm((f) => ({ ...f, noticeContent: e.target.value }))}
            className="min-h-[120px] rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-teal"
            required
            minLength={3}
          />
          <button
            type="submit"
            disabled={creating}
            className="self-end rounded-xl bg-brand-teal px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? 'Posting...' : 'Post Notice'}
          </button>
        </form>
      </div>

      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-xl font-bold text-slate-900">Notice List</h2>

        <div className="mt-5 flex gap-2 border-b border-slate-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2.5 text-sm font-semibold transition ${
                statusTab === tab.key
                  ? 'border-b-2 border-brand-teal text-brand-teal'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wide text-slate-400">
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Category</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && notices.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-400">Loading...</td></tr>
              )}
              {!loading && notices.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-slate-400">No notices found.</td></tr>
              )}
              {notices.map((n) => (
                <tr key={n._id} className="text-slate-700">
                  <td className="px-3 py-3 font-semibold">{n.noticeTitle}</td>
                  <td className="px-3 py-3">{n.noticeCategory}</td>
                  <td className="px-3 py-3">
                    <select
                      value={n.noticeStatus}
                      onChange={(e) => void handleChangeStatus(n._id, e.target.value as NoticeStatus)}
                      className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${statusBadge(n.noticeStatus)}`}
                    >
                      {NOTICE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-3">{new Date(n.createdAt).toLocaleDateString()}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => void handleRemove(n._id)}
                      className="rounded-lg border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <span>{totalCount} notices</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              Prev
            </button>
            <span>{page} / {totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
