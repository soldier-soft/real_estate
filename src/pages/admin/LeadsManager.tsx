import React, { useEffect, useState } from "react";
import {
  Inbox,
  Search,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  Building,
  CheckCircle,
  Filter,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  UserCheck,
  Tag,
  AlertCircle
} from "lucide-react";
import { api, Lead } from "../../services/api";

interface LeadsManagerProps {
  onShowToast: (text: string, type?: "success" | "error") => void;
}

const LeadsManager: React.FC<LeadsManagerProps> = ({ onShowToast }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [currentStatus, setCurrentStatus] = useState("New");

  const loadLeads = async () => {
    setLoading(true);
    try {
      const res = await api.leads.getAll({
        status: statusFilter !== "All" ? statusFilter : undefined,
        search: search.trim() || undefined
      });
      if (res.data.success && Array.isArray(res.data.leads)) {
        setLeads(res.data.leads);
        setStatusCounts(res.data.statusCounts || {});
      }
    } catch {
      onShowToast("Failed to fetch enquiries", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadLeads();
  };

  const handleSelectLead = (lead: Lead) => {
    setSelectedLead(lead);
    setCurrentStatus(lead.status || "New");
    setAdminNotes(lead.admin_notes || lead.adminNotes || "");
  };

  const handleSaveLeadStatus = async () => {
    if (!selectedLead) return;
    setUpdatingStatus(true);
    try {
      const res = await api.leads.updateStatus(selectedLead.id, {
        status: currentStatus,
        adminNotes: adminNotes.trim()
      });
      if (res.data.success) {
        onShowToast("Lead status updated successfully", "success");
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id
              ? { ...l, status: currentStatus, admin_notes: adminNotes.trim() }
              : l
          )
        );
        setSelectedLead((prev) =>
          prev ? { ...prev, status: currentStatus, admin_notes: adminNotes.trim() } : null
        );
      } else {
        onShowToast(res.data.message || "Failed to update lead", "error");
      }
    } catch {
      onShowToast("Error updating lead", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Contacted":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Site Visit Scheduled":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Closed":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-700 text-slate-300";
    }
  };

  const cleanPhone = (p: string) => p.replace(/[^0-9]/g, "");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-850 to-slate-900 border border-slate-700/60 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Inbox className="w-3.5 h-3.5 text-emerald-400" />
              Lead Conversion & CRM
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Customer Enquiries & Site Visit Requests
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl leading-relaxed">
              Track phone, WhatsApp, and form submissions with attached property titles, buyer budgets, and follow-up status.
            </p>
          </div>

          <button
            onClick={loadLeads}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-blue-400" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {["All", "New", "Contacted", "Site Visit Scheduled", "Closed"].map((st) => {
            const count = st === "All" ? leads.length : statusCounts[st] || 0;
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700/60"
                }`}
              >
                <span>{st}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-700 text-slate-400"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, prop..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Leads List */}
        <div className="lg:col-span-7 space-y-3">
          {leads.length === 0 ? (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-12 text-center text-slate-400">
              <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-500" />
              <p className="text-sm font-semibold">No enquiries found for this filter.</p>
              <p className="text-xs text-slate-500 mt-1">
                New buyer enquiries from the website will appear here in real time.
              </p>
            </div>
          ) : (
            leads.map((lead) => {
              const isSelected = selectedLead?.id === lead.id;
              const phoneDigits = cleanPhone(lead.phone);
              return (
                <div
                  key={lead.id}
                  onClick={() => handleSelectLead(lead)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-800 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        {lead.name}
                        {lead.status === "New" && (
                          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        )}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 font-mono">{lead.phone}</p>
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(lead.status || "New")}`}>
                      {lead.status || "New"}
                    </span>
                  </div>

                  {lead.property_title && (
                    <div className="text-xs text-emerald-400 font-medium flex items-center gap-1.5 mb-2 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg w-fit">
                      <Building className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[280px]">Interested in: {lead.property_title}</span>
                    </div>
                  )}

                  {lead.message && (
                    <p className="text-xs text-slate-300 line-clamp-2 italic leading-relaxed mb-3">
                      "{lead.message}"
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {lead.created_at ? new Date(lead.created_at).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recent"}
                    </span>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${lead.phone}`}
                        className="p-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white rounded-lg transition-colors"
                        title="Call Customer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits}?text=${encodeURIComponent(`Hello ${lead.name}, thank you for contacting Sri Chakra Real Estate regarding our plots. How can we assist you today?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-600/20 text-emerald-300 hover:bg-emerald-600 hover:text-white rounded-lg transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Selected Lead Detail / Follow-up */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-3xl p-6 md:p-7 shadow-xl space-y-6 sticky top-6">
              <div className="border-b border-slate-700 pb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Lead Details & Follow-Up
                </span>
                <h3 className="text-xl font-bold text-white mt-1">{selectedLead.name}</h3>
                <div className="flex items-center gap-3 mt-2">
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {selectedLead.phone}
                  </a>
                  {selectedLead.email && (
                    <span className="text-xs text-slate-400">| {selectedLead.email}</span>
                  )}
                </div>
              </div>

              {/* Property Inquired */}
              {selectedLead.property_title && (
                <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">
                    Property Inquired
                  </span>
                  <p className="text-xs font-semibold text-white">{selectedLead.property_title}</p>
                </div>
              )}

              {/* Message */}
              {selectedLead.message && (
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold mb-1">
                    Customer Message
                  </span>
                  <div className="p-3.5 bg-slate-900/80 border border-slate-700 rounded-xl text-xs text-slate-200 leading-relaxed italic">
                    "{selectedLead.message}"
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Buyer
                </a>
                <a
                  href={`https://wa.me/${cleanPhone(selectedLead.phone).length === 10 ? `91${cleanPhone(selectedLead.phone)}` : cleanPhone(selectedLead.phone)}?text=${encodeURIComponent(`Hello ${selectedLead.name}, thank you for contacting Sri Chakra Real Estate. We received your enquiry for ${selectedLead.property_title || "plots in Ranipet/Vellore"}. When would be a good time for a site visit?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                </a>
              </div>

              {/* Status Updater */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Update Lead Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  <option value="New">New Enquiry</option>
                  <option value="Contacted">Contacted / Spoke to Buyer</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Closed">Closed / Plot Purchased</option>
                </select>

                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 pt-2">
                  Admin Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record site visit dates, client budget preferences, negotiated terms..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed"
                />

                <button
                  type="button"
                  onClick={handleSaveLeadStatus}
                  disabled={updatingStatus}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {updatingStatus ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="w-3.5 h-3.5" />
                  )}
                  Save Lead Update
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-12 text-center text-slate-400">
              Select an enquiry from the list to view full details, initiate WhatsApp/call, and manage follow-up status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadsManager;
