"use client";

import { useState, useEffect, useCallback } from "react";
import { StarIcon as StarIconSolid } from "@heroicons/react/24/solid";
import { StarIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/store/authStore";
import { getAppReviews, createReview } from "@/lib/api";
import { ReviewWithUser, ReviewForm } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import toast from "react-hot-toast";

interface ReviewSectionProps {
  appId: number;
}

export function ReviewSection({ appId }: ReviewSectionProps) {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    rating: 5,
    comment: "",
  });

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);
      const reviewsData = await getAppReviews(appId);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setIsLoading(false);
    }
  }, [appId]);

  useEffect(() => {
    fetchReviews();
  }, [appId, fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("レビューを投稿するにはログインが必要です");
      return;
    }

    if (reviewForm.rating < 1 || reviewForm.rating > 5) {
      toast.error("評価は1〜5の範囲で入力してください");
      return;
    }

    try {
      setIsSubmitting(true);

      await createReview(appId, {
        rating: reviewForm.rating,
        comment: reviewForm.comment?.trim() || undefined,
      });

      // Reset form and close
      setReviewForm({ rating: 5, comment: "" });
      setShowReviewForm(false);

      // Refresh reviews
      await fetchReviews();

      toast.success("レビューを投稿しました！");
    } catch (error) {
      console.error("Failed to submit review:", error);
      toast.error("レビューの投稿に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    rating: number,
    interactive = false,
    onStarClick?: (rating: number) => void,
  ) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= rating;
      const StarComponent = isFilled ? StarIconSolid : StarIcon;

      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => interactive && onStarClick?.(i)}
          className={`h-5 w-5 ${
            isFilled ? "text-yellow-400" : "text-gray-300"
          } ${
            interactive
              ? "cursor-pointer hover:text-yellow-400 transition-colors"
              : "cursor-default"
          }`}
          disabled={!interactive}
        >
          <StarComponent />
        </button>,
      );
    }

    return <div className="flex items-center space-x-1">{stars}</div>;
  };

  const userHasReviewed = reviews.some((review) => review.user_id === user?.id);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          レビュー ({reviews.length})
        </h2>

        {isAuthenticated && !userHasReviewed && (
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            レビューを書く
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            レビューを投稿
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                評価
              </label>
              {renderStars(reviewForm.rating, true, (rating) =>
                setReviewForm((prev) => ({ ...prev, rating })),
              )}
              <p className="mt-1 text-sm text-gray-500">
                クリックして評価を選択してください
              </p>
            </div>

            {/* Comment */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                コメント（任意）
              </label>
              <textarea
                id="comment"
                rows={4}
                value={reviewForm.comment}
                onChange={(e) =>
                  setReviewForm((prev) => ({
                    ...prev,
                    comment: e.target.value,
                  }))
                }
                className="block w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                placeholder="アプリの使用感想、改善提案などをお聞かせください..."
                maxLength={1000}
              />
              <p className="mt-1 text-sm text-gray-500">
                {reviewForm.comment?.length || 0}/1000文字
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "投稿中..." : "投稿する"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReviewForm(false);
                  setReviewForm({ rating: 5, comment: "" });
                }}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User has already reviewed */}
      {isAuthenticated && userHasReviewed && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            すでにこのアプリにレビューを投稿済みです。
          </p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                  <div className="h-16 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    {review.user?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={review.user.avatar_url}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900">
                      {review.user?.name || "匿名ユーザー"}
                    </h4>
                    <span className="text-sm text-gray-500">•</span>
                    <time className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                        locale: ja,
                      })}
                    </time>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-2">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {review.rating}.0
                    </span>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <StarIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            まだレビューがありません
          </h3>
          <p className="text-gray-500">
            このアプリを使用した方は、ぜひレビューを投稿してください。
          </p>
        </div>
      )}
    </div>
  );
}
