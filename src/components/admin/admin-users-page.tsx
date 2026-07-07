'use client';

import { useState } from 'react';
import Image from 'next/image';
import Swal from 'sweetalert2';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_MEMBERS_BY_ADMIN, UPDATE_MEMBER_BY_ADMIN } from './admin-queries';
import type { MembersByAdminResult, MemberType, MemberStatus } from './admin-types';
import { getAssetUrl } from '@/lib/config/env';

const STATUS_TABS: { key: MemberStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'BLOCKED', label: 'Blocked' },
  { key: 'DELETED', label: 'Deleted' },
];

const MEMBER_TYPES: MemberType[] = ['USER', 'AGENT', 'ADMIN'];
const MEMBER_STATUSES: MemberStatus[] = ['ACTIVE', 'BLOCKED', 'DELETED'];

const LIMIT = 20;

const statusBadge = (status: MemberStatus) => {
  const map: Record<MemberStatus, string> = {
    ACTIVE: 'bg-emerald-50 text-emerald-700',
    BLOCKED: 'bg-rose-50 text-rose-700',
    DELETED: 'bg-slate-200 text-slate-600',
  };
  return map[status];
};

export const AdminUsersPage = () => {
  const [statusTab, setStatusTab] = useState<MemberStatus | 'ALL'>('ALL');
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, refetch } = useQuery<{ getAllMembersByAdmin: MembersByAdminResult }>(
    GET_ALL_MEMBERS_BY_ADMIN,
    {
      variables: {
        input: {
          page,
          limit: LIMIT,
          ...(statusTab !== 'ALL' ? { memberStatus: statusTab } : {}),
          ...(searchText.trim() ? { searchText: searchText.trim() } : {}),
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const [updateMember] = useMutation(UPDATE_MEMBER_BY_ADMIN);

  const members = data?.getAllMembersByAdmin?.list ?? [];
  const totalCount = data?.getAllMembersByAdmin?.meta?.totalCount ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

  const handleTabChange = (tab: MemberStatus | 'ALL') => {
    setStatusTab(tab);
    setPage(1);
  };

  const handleChangeType = async (targetMemberId: string, memberType: MemberType) => {
    await updateMember({ variables: { input: { targetMemberId, memberType } } });
    await refetch();
  };

  const handleChangeStatus = async (targetMemberId: string, memberStatus: MemberStatus) => {
    if (memberStatus === 'DELETED') {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete this member?',
        text: 'This will mark the member as deleted.',
        showCancelButton: true,
        confirmButtonText: 'Delete',
        confirmButtonColor: '#e11d48',
      });
      if (!result.isConfirmed) return;
    }
    await updateMember({ variables: { input: { targetMemberId, memberStatus } } });
    await refetch();
  };

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-teal">Admin / Users</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">User List</h1>
        </div>
        <input
          type="text"
          placeholder="Search user name"
          value={searchText}
          onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
          className="w-64 rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand-teal"
        />
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
              <th className="px-3 py-2">Member</th>
              <th className="px-3 py-2">Full name</th>
              <th className="px-3 py-2">Contact</th>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Warnings</th>
              <th className="px-3 py-2">Joined</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && members.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-400">Loading...</td></tr>
            )}
            {!loading && members.length === 0 && (
              <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-400">No members found.</td></tr>
            )}
            {members.map((m) => (
              <tr key={m._id} className="text-slate-700">
                <td className="flex items-center gap-3 px-3 py-3">
                  <div className="relative h-9 w-9 overflow-hidden rounded-full bg-slate-100">
                    <Image src={getAssetUrl(m.memberImage) || '/theme/images/team/2.jpg'} alt={m.memberNick} fill className="object-cover" />
                  </div>
                  <span className="font-semibold">{m.memberNick}</span>
                </td>
                <td className="px-3 py-3">{m.memberFullName || '-'}</td>
                <td className="px-3 py-3">{m.memberPhone || m.memberEmail || '-'}</td>
                <td className="px-3 py-3">
                  <select
                    value={m.memberType}
                    onChange={(e) => void handleChangeType(m._id, e.target.value as MemberType)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold"
                  >
                    {MEMBER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">
                  <select
                    value={m.memberStatus}
                    onChange={(e) => void handleChangeStatus(m._id, e.target.value as MemberStatus)}
                    className={`rounded-lg px-2 py-1.5 text-xs font-semibold ${statusBadge(m.memberStatus)}`}
                  >
                    {MEMBER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3">{m.memberWarnings}</td>
                <td className="px-3 py-3">{new Date(m.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
        <span>{totalCount} members</span>
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
