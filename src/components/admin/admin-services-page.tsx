'use client';

import { useState } from 'react';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_SERVICES_BY_ADMIN, UPDATE_SERVICE_BY_ADMIN, REMOVE_SERVICE_BY_ADMIN } from './admin-queries';
import type { ServicesByAdminResult, ServiceStatus, ServiceCategory } from './admin-types';

const STATUS_TABS: { key: ServiceStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'HOLD', label: 'Hold' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'DELETED', label: 'Deleted' },
];

const SERVICE_STATUSES: ServiceStatus[] = ['HOLD', 'ACTIVE', 'REJECTED', 'DELETED'];

const SERVICE_CATEGORIES: ServiceCategory[] = [
  'PLUMBING', 'GAS_LINE', 'ELECTRICITY', 'WATER_LINE',
  'BATHROOM_PLUMBING', 'BASEMENT_PLUMBING', 'REMODELING', 'CLEANING',
];

const LIMIT = 20;

const formatKRW = (n: number) =>
  new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(n);

const formatLabel = (c: string) => c.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

const statusBadge = (status: ServiceStatus) => {
  const map: Record<ServiceStatus, string> = {
    HOLD: 'bg-amber-50 text-amber-700',
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    REJECTED: 'bg-rose-50 text-rose-700',
    DELETED: 'bg-slate-200 text-slate-600',
  };
  return map[status];
};

export const AdminServicesPage = () => {
  const [statusTab, setStatusTab] = useState<ServiceStatus | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'ALL'>('ALL');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery<{ getAllServicesByAdmin: ServicesByAdminResult }>(
    GET_ALL_SERVICES_BY_ADMIN,
    {
      variables: {
        input: {
          page,
          limit: LIMIT,
          ...(statusTab !== 'ALL' ? { serviceStatus: statusTab } : {}),
          ...(categoryFilter !== 'ALL' ? { serviceCategory: categoryFilter } : {}),
          ...(searchText.trim() ? { searchText: searchText.trim() } : {}),
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const [updateService] = useMutation(UPDATE_SERVICE_BY_ADMIN);
  const [removeService] = useMutation(REMOVE_SERVICE_BY_ADMIN);

  const services = data?.getAllServicesByAdmin?.list ?? [];
  const totalCount = data?.getAllServicesByAdmin?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  const handleTabChange = (tab: ServiceStatus | 'ALL') => {
    setStatusTab(tab);
    setPage(1);
  };

  const handleChangeStatus = async (targetServiceId: string, serviceStatus: ServiceStatus) => {
    await updateService({ variables: { input: { targetServiceId, serviceStatus } } });
    await refetch();
  };

  const handleRemove = async (targetServiceId: string) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Delete this service?',
      text: 'This action cannot be undone.',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#e11d48',
    });
    if (!result.isConfirmed) return;
    await removeService({ variables: { input: { targetServiceId } } });
    await refetch();
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal">Admin / Services</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Service List</h1>
        </div>
        <div className="flex gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value as ServiceCategory | 'ALL'); setPage(1); }}
            className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
          >
            <option value="ALL">All categories</option>
            {SERVICE_CATEGORIES.map((c) => <option key={c} value={c}>{formatLabel(c)}</option>)}
          </select>
          <input
            type="text"
            placeholder="Search title"
            value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
            className="w-56 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-teal"
          />
        </div>
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
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Price</th>
              <th className="px-3 py-2">Area</th>
              <th className="px-3 py-2">Views / Likes</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && services.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && services.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-400">No services found.</td></tr>
            )}
            {services.map((s) => (
              <tr key={s._id} className="text-slate-700">
                <td className="px-3 py-3 font-semibold">{s.serviceTitle}</td>
                <td className="px-3 py-3">{formatLabel(s.serviceCategory)}</td>
                <td className="px-3 py-3">{formatKRW(s.servicePrice)}</td>
                <td className="px-3 py-3">{s.serviceArea || '-'}</td>
                <td className="px-3 py-3">{s.serviceViews} / {s.serviceLikes}</td>
                <td className="px-3 py-3">
                  <select
                    value={s.serviceStatus}
                    onChange={(e) => void handleChangeStatus(s._id, e.target.value as ServiceStatus)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${statusBadge(s.serviceStatus)}`}
                  >
                    {SERVICE_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">{new Date(s.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-3">
                  <button
                    type="button"
                    onClick={() => void handleRemove(s._id)}
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
        <span>{totalCount} services</span>
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
