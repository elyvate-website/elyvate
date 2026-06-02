import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

export const ContactPage: React.FC = () => {
  const { cms, addContactMessage, themeMode } = useApp();
  const contact = cms.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [alert, setAlert] = useState<{ success: boolean; msg: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;
    
    addContactMessage(name, email, subject, message);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    // Set feedback alert
    setAlert({ success: true, msg: 'Support ticket dispatched successfully! Our team will align shortly via email.' });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  return (
    <div className={`transition-all duration-350 bg-transparent ${themeMode === 'light' ? 'text-slate-900' : 'text-white'} py-16`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Title layout */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className={`text-[10px] tracking-[0.35em] font-extrabold uppercase ${themeMode === 'light' ? 'text-indigo-650' : 'text-purple-400'}`}>MISSION CONTROL</span>
          <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight uppercase leading-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>
            GET IN TOUCH WITH STELLAR ASSIST
          </h1>
          <p className={`text-xs sm:text-sm ${themeMode === 'light' ? 'text-slate-500' : 'text-zinc-400'}`}>
            Have a custom hospitality lighting request or need immediate parts assistance with your replacement remote? Align your ticket.
          </p>
          <div className={`w-12 h-0.5 mx-auto ${themeMode === 'light' ? 'bg-indigo-600' : 'bg-purple-500'}`} />
        </div>

        {/* Double-Column Grid layout: Left Contact card info + Right Form inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-5xl mx-auto">
          
          {/* L: CONTACT METRICS DETAILS */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className={`text-lg font-bold uppercase tracking-tight ${themeMode === 'light' ? 'text-slate-900' : 'text-white'}`}>COMMUNICATION RADARS</h3>
            <p className={`text-[11px] uppercase tracking-wider leading-relaxed ${themeMode === 'light' ? 'text-slate-550' : 'text-zinc-400'}`}>
              Our New York fulfillment office monitors incoming trajectories continuously.
            </p>

            <div className="space-y-4">
              
              {/* Mail component */}
              <div className={`flex gap-4 p-4.5 border rounded-xl transition-all duration-300 ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-850'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 border ${
                  themeMode === 'light' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-purple-950/40 border-purple-800/20 text-purple-400'
                }`}>
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className={`text-[10px] tracking-widest font-black uppercase ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>Gateway Email</h4>
                  <a href={`mailto:${contact.email}`} className={`text-xs font-bold uppercase transition mt-1 block ${
                    themeMode === 'light' ? 'text-indigo-650 hover:text-indigo-750' : 'text-white hover:text-purple-400'
                  }`}>
                    {contact.email}
                  </a>
                </div>
              </div>

              {/* Phone component */}
              <div className={`flex gap-4 p-4.5 border rounded-xl transition-all duration-300 ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-850'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 border ${
                  themeMode === 'light' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-purple-950/40 border-purple-800/20 text-purple-400'
                }`}>
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className={`text-[10px] tracking-widest font-black uppercase ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>Support Hotline</h4>
                  <a href={`tel:${contact.phone}`} className={`text-xs font-bold uppercase transition mt-1 block ${
                    themeMode === 'light' ? 'text-indigo-650 hover:text-indigo-750' : 'text-white hover:text-purple-400'
                  }`}>
                    {contact.phone}
                  </a>
                </div>
              </div>

              {/* Address component */}
              <div className={`flex gap-4 p-4.5 border rounded-xl transition-all duration-300 ${
                themeMode === 'light' ? 'bg-white border-slate-150 shadow-md shadow-indigo-100/5' : 'bg-zinc-900 border-neutral-850'
              }`}>
                <div className={`p-2 rounded-lg shrink-0 border ${
                  themeMode === 'light' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-purple-950/40 border-purple-800/20 text-purple-400'
                }`}>
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className={`text-[10px] tracking-widest font-black uppercase ${themeMode === 'light' ? 'text-slate-450' : 'text-zinc-500'}`}>Fulfillment HQ</h4>
                  <p className={`text-xs font-bold uppercase mt-1 leading-relaxed ${themeMode === 'light' ? 'text-slate-800' : 'text-white'}`}>
                    {contact.address}
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* R: CONTACT SUBMISSION WIDGET FORM */}
          <div className={`lg:col-span-7 border p-6 sm:p-8 rounded-xl space-y-6 transition-all duration-350 ${
            themeMode === 'light' ? 'bg-white border-slate-150 shadow-xl shadow-indigo-150/5' : 'bg-zinc-900 border-neutral-805'
          }`}>
            <h3 className={`text-xs font-black tracking-widest uppercase border-b pb-3 ${
              themeMode === 'light' ? 'text-slate-905 border-slate-150' : 'text-white border-neutral-800'
            }`}>INITIATE RADAR INQUIRY</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Your Identity</label>
                  <input
                    id="contact-form-name"
                    type="text"
                    required
                    placeholder="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-indigo-650 transition-all ${
                      themeMode === 'light' 
                        ? 'bg-slate-50 border-slate-205 text-slate-900 placeholder:text-slate-400' 
                        : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-650'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Email Radar</label>
                  <input
                    id="contact-form-email"
                    type="email"
                    required
                    placeholder="email@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-indigo-650 transition-all ${
                      themeMode === 'light' 
                        ? 'bg-slate-50 border-slate-205 text-slate-900 placeholder:text-slate-400' 
                        : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-650'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Transmission Subject</label>
                <input
                  id="contact-form-subject"
                  type="text"
                  required
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-indigo-655 transition-all ${
                    themeMode === 'light' 
                      ? 'bg-slate-50 border-slate-205 text-slate-900 placeholder:text-slate-400' 
                      : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-655'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-[10px] tracking-wider font-bold mb-1 uppercase ${themeMode === 'light' ? 'text-slate-600' : 'text-neutral-400'}`}>Confined Details Message</label>
                <textarea
                  id="contact-form-message"
                  required
                  rows={4}
                  placeholder="Write clear coordinates details here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full text-xs px-3.5 py-2.5 rounded-lg border focus:outline-none focus:border-indigo-655 transition-all resize-none ${
                    themeMode === 'light' 
                      ? 'bg-slate-50 border-slate-205 text-slate-900 placeholder:text-slate-400' 
                      : 'bg-neutral-950 border-neutral-800 text-white placeholder:text-neutral-655'
                  }`}
                />
              </div>

              {alert && (
                <div className={`p-4 rounded-lg flex items-start gap-2 text-xs font-semibold ${
                  alert.success 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400'
                }`}>
                  {alert.success ? <CheckCircle2 className="h-4.5 w-4.5 shrink-0" /> : <AlertCircle className="h-4.5 w-4.5 shrink-0" />}
                  <span>{alert.msg}</span>
                </div>
              )}

              <button
                id="contact-form-submit-btn"
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-650 to-purple-600 hover:from-indigo-550 hover:to-purple-500 text-xs font-bold uppercase rounded-lg tracking-widest text-center transition flex justify-center items-center gap-2 text-white cursor-pointer shadow-md"
              >
                <Send className="h-3.5 w-3.5" />
                <span>DISPATCH TRANSMISSION</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
