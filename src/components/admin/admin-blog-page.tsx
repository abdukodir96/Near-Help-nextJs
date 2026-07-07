'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_ARTICLES_BY_ADMIN, UPDATE_ARTICLE_BY_ADMIN, REMOVE_ARTICLE_BY_ADMIN } from './admin-queries';
import type { ArticlesByAdminResult, ArticleStatus, ArticleCategory } from './admin-types';

const STATUS_TABS: { key: ArticleStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'DELETED', label: 'Deleted' },
];

const ARTICLE_STATUSES: ArticleStatus[] = ['ACTIVE', 'DELETED'];
const ARTICLE_CATEGORIES: ArticleCategory[] = ['FREE', 'RECOMMEND', 'NEWS', 'HUMOR'];

const LIMIT = 20;

const statusBadge = (status: ArticleStatus) => {
  const map: Record<ArticleStatus, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    DELETED: 'bg-slate-200 text-slate-600',
  };
  return map[status];
};

export const AdminBlogPage = () => {
  const [statusTab, setStatusTab] = useState<ArticleStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery<{ getAllArticlesByAdmin: ArticlesByAdminResult }>(
    GET_ALL_ARTICLES_BY_ADMIN,
    {
      variables: {
        input: {
          page,
          limit: LIMIT,
          search: {
            ...(statusTab !== 'ALL' ? { articleStatus: statusTab } : {}),
            ...(categoryFilter !== 'ALL' ? { articleCategory: categoryFilter } : {}),
          },
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const [updateArticle] = useMutation(UPDATE_ARTICLE_BY_ADMIN);
  const [removeArticle] = useMutation(REMOVE_ARTICLE_BY_ADMIN);

  const articles = data?.getAllArticlesByAdmin?.list ?? [];
  const totalCount = data?.getAllArticlesByAdmin?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  const handleTabChange = (tab: ArticleStatus | 'ALL') => {
    setStatusTab(tab);
    setPage(1);
  };

  const handleChangeStatus = async (targetArticleId: string, articleStatus: ArticleStatus) => {
    await updateArticle({ variables: { input: { targetArticleId, articleStatus } } });
    await refetch();
  };

  const handleRemove = async (targetArticleId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this article?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#e11d48',
    });
    if (!result.isConfirmed) return;
    await removeArticle({ variables: { input: { targetArticleId } } });
    await refetch();
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal">Admin / Blog</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Article Moderation</h1>
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value as ArticleCategory | 'ALL'); setPage(1); }}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
        >
          <option value="ALL">All categories</option>
          {ARTICLE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

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
              <th className="px-3 py-2">Views / Likes</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && articles.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && articles.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-8 text-center text-slate-400">No articles found.</td></tr>
            )}
            {articles.map((a) => (
              <tr key={a._id} className="text-slate-700">
                <td className="px-3 py-3 font-semibold">{a.articleTitle}</td>
                <td className="px-3 py-3">{a.articleCategory}</td>
                <td className="px-3 py-3">{a.articleViews} / {a.articleLikes}</td>
                <td className="px-3 py-3">
                  <select
                    value={a.articleStatus}
                    onChange={(e) => void handleChangeStatus(a._id, e.target.value as ArticleStatus)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${statusBadge(a.articleStatus)}`}
                  >
                    {ARTICLE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">{new Date(a.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => void handleRemove(a._id)}
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
        <span>{totalCount} articles</span>
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
  );
};
