import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, Sparkles, Send, CheckCircle2, ShieldCheck, MapPin, User } from 'lucide-react';
import { TourismService } from '../types';
import { useApp } from '../context/AppContext';

interface ReviewModalProps {
  service: TourismService | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ service, onClose }) => {
  const { getApprovedReviews, getServiceRating, addReview, theme } = useApp();

  const [authorName, setAuthorName] = useState('');
  const [location, setLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!service) return null;

  const approvedReviews = getApprovedReviews(service.id);
  const ratingSummary = getServiceRating(service.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    await addReview(service.id, authorName, rating, comment, location);
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setAuthorName('');
    setLocation('');
    setRating(5);
    setComment('');
    setIsSubmitted(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 25 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl z-10 text-right max-h-[90vh] overflow-y-auto ${
            theme === 'light'
              ? 'border-slate-200 bg-white text-slate-900 shadow-2xl'
              : 'border-amber-400/30 bg-gradient-to-b from-slate-900 via-[#0a1224] to-[#060a16] text-slate-100 shadow-[0_25px_60px_rgba(0,0,0,0.9)]'
          }`}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className={`absolute top-5 left-5 p-2 rounded-full border transition-colors ${
              theme === 'light'
                ? 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:text-amber-300 hover:border-amber-400/60'
            }`}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header */}
          <div className="pr-1 mb-6">
            <div className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-bold mb-2 ${
              theme === 'light'
                ? 'border-amber-400/40 bg-amber-50 text-amber-950 shadow-sm'
                : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              <span>تقييمات وتجارب ضيوف النخبة</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gold-gradient">
              {service.title}
            </h3>
            <p className={`text-xs sm:text-sm mt-1 font-mono ${
              theme === 'light' ? 'text-slate-600' : 'text-slate-400'
            }`}>
              {service.englishTitle}
            </p>
          </div>

          {/* Overall Rating Score Bar */}
          <div className={`rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 ${
            theme === 'light'
              ? 'border-slate-200 bg-slate-50 shadow-sm'
              : 'border-amber-400/20 bg-slate-950/60'
          }`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-gold-gradient font-mono tabular-nums">
                {ratingSummary.average.toFixed(1)}
              </span>
              <div>
                <div className="flex text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(ratingSummary.average)
                          ? 'fill-amber-400 text-amber-400'
                          : theme === 'light' ? 'fill-transparent text-slate-300' : 'fill-transparent text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-xs mt-0.5 block ${
                  theme === 'light' ? 'text-slate-600 font-medium' : 'text-slate-400'
                }`}>
                  متوسط التقييم العام ({ratingSummary.count} تقييم معتمد)
                </span>
              </div>
            </div>

            <div className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl ${
              theme === 'light'
                ? 'text-emerald-800 bg-emerald-50 border border-emerald-300 font-semibold'
                : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
            }`}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>تقييمات حقيقية خاضعة للتدقيق والاعتماد</span>
            </div>
          </div>

          {/* Approved Reviews List */}
          <div className="space-y-4 mb-8">
            <h4 className={`text-sm font-bold ${
              theme === 'light' ? 'text-slate-900' : 'text-amber-200'
            }`}>
              آراء الضيوف المعتمدة ({approvedReviews.length})
            </h4>

            {approvedReviews.length === 0 ? (
              <div className={`rounded-2xl border p-6 text-center text-sm ${
                theme === 'light'
                  ? 'border-slate-200 bg-slate-50 text-slate-600'
                  : 'border-slate-800 bg-slate-950/40 text-slate-400'
              }`}>
                لم يتم نشر تقييمات معتمدة بعد لهذه الخدمة. كن أول من يشارك تجربته الراقية!
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {approvedReviews.map((rev) => (
                  <motion.div
                    key={rev.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-2xl border p-4 ${
                      theme === 'light'
                        ? 'border-slate-200 bg-slate-50 text-slate-900 shadow-sm'
                        : 'border-amber-400/15 bg-slate-950/50 text-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          theme === 'light'
                            ? 'bg-amber-100 border border-amber-300 text-amber-800'
                            : 'bg-amber-400/10 border border-amber-400/30 text-amber-300'
                        }`}>
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <span className={`text-xs font-bold block ${
                            theme === 'light' ? 'text-slate-900' : 'text-slate-200'
                          }`}>
                            {rev.authorName}
                          </span>
                          {rev.location && (
                            <span className={`text-[10px] flex items-center gap-1 ${
                              theme === 'light' ? 'text-slate-500' : 'text-slate-400'
                            }`}>
                              <MapPin className="h-2.5 w-2.5 text-amber-500" />
                              {rev.location}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className={`text-xs sm:text-sm leading-relaxed ${
                      theme === 'light' ? 'text-slate-700' : 'text-slate-300'
                    }`}>
                      {rev.comment}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* New Review Form (No Login Required + Strict Pending Moderation) */}
          <div className={`rounded-2xl border p-5 sm:p-6 ${
            theme === 'light'
              ? 'border-slate-200 bg-slate-50 shadow-inner'
              : 'border-amber-400/20 bg-slate-950/60'
          }`}>
            {!isSubmitted ? (
              <div>
                <h4 className={`text-sm font-bold mb-1 ${
                  theme === 'light' ? 'text-slate-900' : 'text-amber-200'
                }`}>
                  شارك تجربتك وانطباعك كضيف VIP
                </h4>
                <p className={`text-xs mb-4 ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  لا يتطلب تسجيل دخول. يخضع كل تقييم للمراجعة والاعتماد من قبل الإدارة قبل ظهوره علناً.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Rating Selector */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1.5 ${
                      theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      تقييمك للخدمة (1 - 5 نجوم) *
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-125 focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400'
                                : theme === 'light' ? 'fill-transparent text-slate-300' : 'fill-transparent text-slate-600'
                            }`}
                          />
                        </button>
                      ))}
                      <span className={`text-xs font-bold mr-2 font-mono ${
                        theme === 'light' ? 'text-amber-800' : 'text-amber-300'
                      }`}>
                        ({hoverRating || rating} من 5)
                      </span>
                    </div>
                  </div>

                  {/* Name and Location row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${
                        theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}>
                        الاسم الكريم *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: خالد العتيبي"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500'
                            : 'border-amber-400/25 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold mb-1 ${
                        theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                      }`}>
                        المدينة / الدولة (اختياري)
                      </label>
                      <input
                        type="text"
                        placeholder="مثال: الرياض، السعودية"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                          theme === 'light'
                            ? 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500'
                            : 'border-amber-400/25 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus:border-amber-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Comment text */}
                  <div>
                    <label className={`block text-xs font-semibold mb-1 ${
                      theme === 'light' ? 'text-slate-800' : 'text-slate-300'
                    }`}>
                      نص التجربة أو التعليق *
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="صف تجربتك مع الخدمة، الاستقبال، والرفاهية المقدمة..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs focus:outline-none ${
                        theme === 'light'
                          ? 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500'
                          : 'border-amber-400/25 bg-slate-950/80 text-slate-100 placeholder:text-slate-500 focus:border-amber-400'
                      }`}
                    />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 font-bold text-xs sm:text-sm transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 ${
                      theme === 'light'
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md border border-amber-400'
                        : 'text-slate-950'
                    }`}
                    style={
                      theme === 'light'
                        ? undefined
                        : {
                            background: 'linear-gradient(135deg, #FFF0B3 0%, #D4AF37 45%, #AA771C 80%, #F5DE93 100%)',
                          }
                    }
                  >
                    <Send className="h-4 w-4" />
                    <span>إرسال التقييم للمراجعة والاعتماد</span>
                  </button>
                </form>
              </div>
            ) : (
              /* Thank-you state upon submission */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6"
              >
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className={`text-lg font-bold ${
                  theme === 'light' ? 'text-slate-900' : 'text-slate-100'
                }`}>
                  شكراً لك على مشاركة تجربتك الفاخرة!
                </h4>
                <p className={`mt-1 text-xs max-w-md mx-auto leading-relaxed ${
                  theme === 'light' ? 'text-slate-600' : 'text-slate-300'
                }`}>
                  تم استلام تقييمك بنجاح وحفظه بحالة <span className={theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-300 font-semibold'}>(قيد المراجعة Pending)</span>. سيظهر مباشرة على الصفحة الرئيسية فور اعتماده من قبل الإدارة.
                </p>
                <button
                  onClick={handleReset}
                  className={`mt-4 text-xs font-bold underline underline-offset-4 ${
                    theme === 'light' ? 'text-amber-800 hover:text-amber-950' : 'text-amber-300 hover:text-amber-200'
                  }`}
                >
                  كتابة تقييم آخر
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
