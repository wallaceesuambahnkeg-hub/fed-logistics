import { CheckCircle, Download, Shield, Award, FileText, Globe, Truck, Package } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Capabilities() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="bg-fl-purple text-white pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start gap-6">
          <div>
            <p className="text-fl-orange font-semibold text-sm uppercase tracking-wider mb-3">Federal Contracting</p>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Capabilities Statement</h1>
            <p className="text-xl text-gray-200 max-w-xl">Fed Logistics is a registered logistics and supply chain management company serving federal agencies, defence contractors and commercial enterprises.</p>
          </div>
          <div className="flex-shrink-0">
            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 text-center">
              <FileText className="w-10 h-10 text-fl-orange mx-auto mb-3" />
              <p className="font-bold mb-3">Download Full Statement</p>
              <button className="bg-fl-orange hover:bg-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition flex items-center gap-2 mx-auto">
                <Download className="w-4 h-4" /> PDF Download
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-fl-light">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Company info */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><Shield className="w-6 h-6 text-fl-orange" /> Company Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Legal Name', value: 'Fed Logistics Ltd' },
                { label: 'Business Type', value: 'Logistics & Supply Chain Management' },
                { label: 'Headquarters', value: '1 Canada Square, Canary Wharf, London E14 5AB, UK' },
                { label: 'Phone', value: '+44 7735 380906' },
                { label: 'Email', value: 'info@fedlogisticscorp.com' },
                { label: 'Website', value: 'fed-logistics.onrender.com' },
                { label: 'Year Established', value: '2010' },
                { label: 'Employees', value: '50–200' },
              ].map(i => (
                <div key={i.label} className="flex flex-col">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{i.label}</p>
                  <p className="font-semibold text-fl-dark mt-1">{i.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Registration codes */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><Award className="w-6 h-6 text-fl-orange" /> Registration & Codes</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'CAGE Code', value: 'Available on request' },
                { label: 'DUNS / UEI Number', value: 'Available on request' },
                { label: 'SAM.gov Registered', value: 'Yes — Active Registration' },
                { label: 'Business Size', value: 'Small Business' },
              ].map(i => (
                <div key={i.label} className="flex flex-col border-l-4 border-fl-orange pl-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{i.label}</p>
                  <p className="font-bold text-fl-dark mt-1">{i.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-sm text-blue-700">For official CAGE Code, DUNS/UEI and SAM.gov verification, please <Link to="/contact" className="font-bold underline">contact our contracts team</Link>.</p>
            </div>
          </div>

          {/* NAICS codes */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><FileText className="w-6 h-6 text-fl-orange" /> NAICS Codes</h2>
            <div className="space-y-3">
              {[
                { code: '484110', desc: 'General Freight Trucking, Local' },
                { code: '484121', desc: 'General Freight Trucking, Long-Distance, Truckload' },
                { code: '488510', desc: 'Freight Transportation Arrangement' },
                { code: '492110', desc: 'Couriers and Express Delivery Services' },
                { code: '493110', desc: 'General Warehousing and Storage' },
                { code: '541614', desc: 'Process, Physical Distribution & Logistics Consulting' },
              ].map(n => (
                <div key={n.code} className="flex items-center gap-4 p-3 bg-fl-light rounded-lg">
                  <span className="font-mono font-bold text-fl-purple bg-purple-100 px-3 py-1 rounded text-sm">{n.code}</span>
                  <span className="text-gray-700 text-sm font-medium">{n.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core competencies */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><Truck className="w-6 h-6 text-fl-orange" /> Core Competencies</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Federal Supply Chain Management',
                'Transportation Management Systems (TMS)',
                'International Freight & Customs Clearance',
                'Last-Mile Delivery Optimisation',
                'Warehouse & Distribution Management',
                'Cold Chain & Hazmat Logistics',
                'Real-Time Shipment Tracking',
                'Compliance & Regulatory Reporting',
                'Multi-Modal Freight (Air, Ground, Sea)',
                'Government Contract Logistics (FAR Compliant)',
                'Enterprise ERP/WMS Integration',
                'Dedicated Account & SLA Management',
              ].map(c => (
                <div key={c} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Differentiators */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><Globe className="w-6 h-6 text-fl-orange" /> Differentiators</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { title: 'Government-Ready Infrastructure', desc: 'SAM.gov registered, FAR-compliant operations and dedicated federal contracts team.' },
                { title: '99.9% On-Time Delivery', desc: 'Industry-leading delivery performance backed by SLA guarantees for all government clients.' },
                { title: 'Real-Time Technology Platform', desc: 'Proprietary tracking system with full API integration, live dashboards and automated reporting.' },
                { title: 'Global Network', desc: 'Partnerships with 50+ carriers across 200+ countries ensuring reliable last-mile delivery worldwide.' },
              ].map(d => (
                <div key={d.title} className="border-l-4 border-fl-orange pl-4">
                  <p className="font-bold text-fl-dark mb-1">{d.title}</p>
                  <p className="text-sm text-gray-500">{d.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Past performance */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-heading font-bold text-fl-dark mb-6 flex items-center gap-3"><Package className="w-6 h-6 text-fl-orange" /> Past Performance</h2>
            <div className="space-y-4">
              {[
                { client: 'UK Government Agency', contract: 'National Supply Chain Distribution Contract', value: 'Multi-year framework', desc: 'End-to-end logistics management for critical government supplies across the UK.' },
                { client: 'MedTech Corporation', contract: 'Medical Equipment Freight Programme', value: '£2M+ annual', desc: 'Time-sensitive medical device shipping with cold chain management and full compliance documentation.' },
                { client: 'International NGO', contract: 'Humanitarian Aid Logistics', value: 'Multi-country', desc: 'Coordinated freight and last-mile delivery of humanitarian supplies across 15 countries.' },
              ].map(p => (
                <div key={p.client} className="bg-fl-light rounded-xl p-5">
                  <div className="flex justify-between flex-wrap gap-2 mb-2">
                    <p className="font-bold text-fl-dark">{p.client}</p>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">{p.value}</span>
                  </div>
                  <p className="text-sm text-fl-orange font-semibold mb-1">{p.contract}</p>
                  <p className="text-sm text-gray-500">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-fl-purple py-16 px-4 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-heading font-bold mb-4">Ready to Award a Contract?</h2>
          <p className="text-gray-200 mb-8">Contact our government contracts team to discuss your logistics requirements.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/contact" className="bg-fl-orange hover:bg-orange-600 text-white px-8 py-4 rounded-xl font-bold transition">Contact Contracts Team</Link>
            <Link to="/quote" className="border-2 border-white/40 hover:bg-white/10 text-white px-8 py-4 rounded-xl font-bold transition">Request a Quote</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
