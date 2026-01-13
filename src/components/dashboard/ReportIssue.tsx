import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Camera, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ReportIssueProps {
  employeeId?: string;
}

const categories = [
  'Waste Management Issue',
  'Infrastructure Damage',
  'Public Safety Concern',
  'Water & Sanitation',
  'Illegal Encroachment',
  'Road Damage / Pothole',
  'Streetlight Malfunction',
  'Drainage / Sewage',
  'Other'
];

const ReportIssue = ({ employeeId = 'anonymous' }: ReportIssueProps) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("Waste Management Issue");
  const [description, setDescription] = useState("");
  const [reportId, setReportId] = useState<string | null>(null);

  const API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/api`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      toast.error('Please provide a description');
      return;
    }
    
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reports`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "apikey": import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
        },
        body: JSON.stringify({
          employee_id: employeeId,
          category: category,
          description: description
        })
      });

      if (!res.ok) throw new Error('Failed to submit report');

      const data = await res.json();
      setReportId(data.report_id);
      setSubmitted(true);
      toast.success('Report submitted successfully!');
    } catch (error) {
      console.error('Failed to submit report:', error);
      toast.error('Failed to submit report. Please try again.');
    }

    setLoading(false);
  };

  const handleNewReport = () => {
    setSubmitted(false);
    setCategory("Waste Management Issue");
    setDescription("");
    setReportId(null);
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
              <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <AlertCircle className="text-orange-500" /> Report New Incident
              </h1>
              <p className="text-muted-foreground text-sm">
                Please provide accurate details of the issue for rapid resolution.
              </p>
            </div>

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-xl shadow-sm border border-border">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Issue Category
                </label>
                <select 
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-background text-foreground"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Detailed Description
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail (e.g., exact landmark, severity)..."
                  className="w-full p-3 rounded-lg border border-border focus:ring-2 focus:ring-primary outline-none transition-all bg-background text-foreground"
                  required
                />
              </div>

              {/* Attachment Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <Camera className="text-muted-foreground group-hover:text-primary" size={20} />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Attach Evidence</span>
                </button>
                <button 
                  type="button" 
                  className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all group"
                >
                  <MapPin className="text-muted-foreground group-hover:text-primary" size={20} />
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-primary">Tag Live Location</span>
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} /> Submit Official Report
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Success Screen */
          <motion.div 
            key="success-message"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-12 bg-card rounded-xl shadow-md border border-green-200 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 border border-green-200"
            >
              <CheckCircle2 className="text-green-600 w-12 h-12" />
            </motion.div>
            <h2 className="text-2xl font-extrabold text-foreground">Submitted Successfully!</h2>
            <p className="text-muted-foreground mt-3 max-w-sm">
              Your report has been logged in the central database. Our field officers will be notified immediately.
            </p>
            
            {reportId && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Reference ID</p>
                <p className="font-mono font-bold text-lg">{reportId.slice(0, 8).toUpperCase()}</p>
              </div>
            )}

            <div className="mt-4 space-y-1 text-sm">
              <p className="text-muted-foreground">
                Category: <span className="font-medium text-foreground">{category}</span>
              </p>
              <p className="text-muted-foreground">
                Reported by: <span className="font-medium text-foreground">{employeeId}</span>
              </p>
            </div>

            <button 
              onClick={handleNewReport}
              className="mt-8 text-primary font-bold hover:text-primary/80 transition-colors"
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