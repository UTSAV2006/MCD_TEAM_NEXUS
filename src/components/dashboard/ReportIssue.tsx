import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Camera, MapPin, Send, CheckCircle2 } from 'lucide-react';

const ReportIssue = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulating a network request
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="report-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> Report New Incident
              </h1>
              <p className="text-slate-500 text-sm">
                Please provide accurate details of the issue for rapid resolution.
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Issue Category
                </label>
                <select className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-slate-700">
                  <option>Waste Management Issue</option>
                  <option>Infrastructure Damage</option>
                  <option>Public Safety Concern</option>
                  <option>Water & Sanitation</option>
                  <option>Illegal Encroachment</option>
                </select>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Detailed Description
                </label>
                <textarea 
                  rows={4}
                  placeholder="Describe the issue in detail (e.g., exact landmark, severity)..."
                  className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  required
                ></textarea>
              </div>

              {/* Attachment Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <Camera className="text-slate-400 group-hover:text-blue-500" size={20} />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Attach Evidence</span>
                </button>
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <MapPin className="text-slate-400 group-hover:text-blue-500" size={20} />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-blue-600">Tag Live Location</span>
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Submitting..." : <><Send size={18} /> Submit Official Report</>}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Success Screen */
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-md border border-green-100 text-center"
          >
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border border-green-100">
              <CheckCircle2 className="text-green-500 w-12 h-12" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800">Submission Successful</h2>
            <p className="text-slate-500 mt-3 max-w-sm">
              Your report has been logged in the central database. Our field officers will be notified immediately.
            </p>
            <div className="mt-4 p-2 bg-slate-50 rounded text-xs font-mono text-slate-400">
              TICKET_REF: {Math.random().toString(36).substr(2, 9).toUpperCase()}
            </div>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 text-blue-600 font-bold hover:text-blue-800 transition-colors"
            >
              ← File Another Report
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportIssue;