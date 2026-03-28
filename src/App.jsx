import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FilePlus, 
  Files, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download, 
  Settings2,
  Github,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { mergePDFs, downloadPDF } from './utils/pdf-merger';

const App = () => {
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  const onDrop = useCallback((acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf');
    if (pdfFiles.length < acceptedFiles.length) {
      setStatus({ type: 'warning', message: 'Some files were skipped. Only PDF files are allowed.' });
    }
    setFiles(prev => [...prev, ...pdfFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] }
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setStatus({ type: '', message: '' });
  };

  const moveFile = (index, direction) => {
    const newFiles = [...files];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newFiles.length) return;
    [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setStatus({ type: 'error', message: 'Please add at least 2 PDF files to merge.' });
      return;
    }

    setIsMerging(true);
    setStatus({ type: 'info', message: 'Merging your PDFs...' });

    try {
      const mergedBytes = await mergePDFs(files);
      downloadPDF(mergedBytes, `merged_${new Date().getTime()}.pdf`);
      setStatus({ type: 'success', message: 'PDFs merged successfully!' });
      // Optional: Clear files after success
      // setFiles([]);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to merge PDFs. Please try again.' });
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen custom-scrollbar flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl z-10"
      >
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="p-2 premium-gradient rounded-xl shadow-lg shadow-purple-500/20">
              <Files className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">PDF<span className="text-purple-400">Merger</span></h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Safe • Client-side • Fast</p>
            </div>
          </div>
          <div className="flex gap-4">
            <a href="https://github.com/gbvk/pdf-merger" target="_blank" rel="noreferrer" className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <Github className="w-5 h-5 text-muted-foreground" />
            </a>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Column: Dropzone & Files */}
          <div className="lg:col-span-3 space-y-6">
            <div 
              {...getRootProps()} 
              className={`
                glass rounded-2xl p-8 border-2 border-dashed transition-all cursor-pointer 
                flex flex-col items-center justify-center min-h-[240px] text-center
                ${isDragActive ? 'border-purple-500 bg-purple-500/5' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}
              `}
            >
              <input {...getInputProps()} />
              <div className={`p-4 rounded-full mb-4 ${isDragActive ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                <FilePlus className={`w-8 h-8 ${isDragActive ? 'text-purple-400' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="text-lg font-semibold mb-1">
                {isDragActive ? 'Drop your PDFs here' : 'Click or drag PDF files'}
              </h3>
              <p className="text-sm text-muted-foreground">Select multiple PDFs to combine</p>
            </div>

            <AnimatePresence>
              {status.message && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                    status.type === 'error' ? 'bg-red-500/10 text-red-100 border border-red-500/20' :
                    status.type === 'success' ? 'bg-emerald-500/10 text-emerald-100 border border-emerald-500/20' :
                    'bg-blue-500/10 text-blue-100 border border-blue-500/20'
                  }`}
                >
                  {status.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
              <AnimatePresence mode="popLayout">
                {files.map((file, index) => (
                  <motion.div
                    key={`${file.name}-${index}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="glass rounded-xl p-4 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-lg text-xs font-bold text-muted-foreground uppercase">
                        pdf
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                        <p className="text-[10px] text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveFile(index, -1)} disabled={index === 0} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button onClick={() => moveFile(index, 1)} disabled={index === files.length - 1} className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-30">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                      <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-red-500/20 rounded-lg text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Actions & Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass rounded-2xl p-6 flex flex-col h-full">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6 flex items-center gap-2">
                <Settings2 className="w-4 h-4" /> Summary
              </h4>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Files</span>
                  <span className="font-mono font-bold">{files.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Combined Size</span>
                  <span className="font-mono font-bold">
                    {(files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>

              <div className="mt-auto">
                <button
                  onClick={handleMerge}
                  disabled={files.length < 2 || isMerging}
                  className={`
                    w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl
                    ${files.length < 2 || isMerging 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'premium-gradient text-white hover:scale-[1.02] shadow-purple-500/20 animate-glow'}
                  `}
                >
                  {isMerging ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download className="w-5 h-5" />
                  )}
                  {isMerging ? 'Processing...' : 'Merge PDFs'}
                </button>
                <p className="text-[10px] text-center mt-4 text-muted-foreground px-4">
                  By using this tool, your PDFs are processed 100% locally in your browser. Your data never leaves your computer.
                </p>
              </div>
            </div>

            <div className="p-6 glass rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h5 className="text-sm font-semibold mb-1">Local Processing</h5>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use <code className="bg-white/5 px-1 rounded">pdf-lib</code> to handle all operations on the client side.
                </p>
              </div>
            </div>
          </div>
        </main>

        <footer className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-muted-foreground">
          <p className="text-xs">&copy; 2026 PDF Merger Open Source.</p>
          <div className="flex gap-6 text-xs uppercase tracking-widest font-semibold">
            <span className="hover:text-white cursor-help">Terms</span>
            <span className="hover:text-white cursor-help">Privacy</span>
            <span className="hover:text-white cursor-help">Security</span>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default App;
