import React from 'react';
import { Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

export default function Footer({ setCurrentPage }) {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200 px-6 lg:px-12 py-12 text-slate-600 space-y-10">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M 50 10 A 40 40 0 0 1 90 50 A 40 40 0 0 1 50 90 A 40 40 0 0 1 10 50 Z" fill="none" stroke="#10B981" strokeWidth="12" />
              </svg>
            </div>
            <h4 className="text-base font-extrabold text-slate-800 tracking-wider">
              SARABURI SANDBOX
            </h4>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            ร่วมเคียงบ่าเคียงไหล่กับภาครัฐ เอกชน และภาคประชาชน เพื่ออนาคตคาร์บอนต่ำที่สระบุรีและสังคมโลกที่น่าอยู่
          </p>
          <div className="flex gap-3 text-slate-400">
            <a href="#" className="hover:text-emerald-600 transition"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-600 transition"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="hover:text-emerald-600 transition"><Mail className="w-4 h-4" /></a>
          </div>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">แพลตฟอร์ม</h5>
          <ul className="text-xs space-y-2 text-slate-600">
            <li><button onClick={() => setCurrentPage('dashboard')} className="hover:text-emerald-600 transition">แดชบอร์ดสรุปผล</button></li>
            <li><button onClick={() => setCurrentPage('projects')} className="hover:text-emerald-600 transition">ฐานข้อมูลโครงการ</button></li>
            <li><button onClick={() => setCurrentPage('dimensions')} className="hover:text-emerald-600 transition">รายละเอียด 6 มิติ</button></li>
            <li><button onClick={() => setCurrentPage('admin')} className="hover:text-emerald-600 transition">API Gateway Connector</button></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">การมีส่วนร่วม</h5>
          <ul className="text-xs space-y-2 text-slate-600">
            <li><a href="#" className="hover:text-emerald-600 transition">ภาคการมีส่วนร่วมประชาชน</a></li>
            <li><a href="#" className="hover:text-emerald-650 transition">ภาคธุรกิจ/SME คาร์บอนต่ำ</a></li>
            <li><a href="#" className="hover:text-emerald-650 transition">ภาคอุตสาหกรรมปูนซีเมนต์</a></li>
            <li><a href="#" className="hover:text-emerald-650 transition">ข้อมูลเอกสารเผยแพร่</a></li>
          </ul>
        </div>

        <div className="space-y-3 text-xs">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800">ติดต่อโครงการ</h5>
          <ul className="space-y-2 text-slate-600">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>ศาลากลางจังหวัดสระบุรี ต.ตะกุด อ.เมืองสระบุรี จ.สระบุรี 18000</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>036-340-000</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
              <span>saraburi.sandbox@gmail.com</span>
            </li>
          </ul>
        </div>

      </div>

      <div className="max-w-7xl mx-auto w-full pt-8 border-t border-slate-200 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500">
        <p>© 2026 Saraburi Sandbox Platform. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-slate-700 transition">นโยบายสิทธิส่วนบุคคล</a>
          <span>•</span>
          <a href="#" className="hover:text-slate-700 transition">ข้อตกลงและเงื่อนไขการใช้งาน</a>
        </div>
      </div>
    </footer>
  );
}
