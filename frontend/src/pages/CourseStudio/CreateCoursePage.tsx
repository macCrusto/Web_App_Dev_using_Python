import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { courseService } from '@/src/services/courseService';
import { toast } from 'sonner';

export default function CreateCoursePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '35000',
    currency: 'NGN',
    free_count: '2',
    description: '',
    status: 'DRAFT' as 'DRAFT' | 'PUBLISHED',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error('Please enter a course title');
      return;
    }

    setLoading(true);

    try {
      const response = await courseService.createCourse({
        title: formData.title.trim(),
        price: Number(formData.price) || 0,
        currency: formData.currency,
        free_count: Number(formData.free_count) || 1,
        description: formData.description.trim(),
        status: formData.status,
      });

      const newCourseId = response.course?.id || (response.data as { id?: number })?.id || 1;
      toast.success('Course created successfully!');
      navigate(`/instructor/courses/${newCourseId}/curriculum`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-xs text-muted-foreground hover:text-foreground pl-0"
      >
        <ArrowLeft className="mr-1.5 size-3.5" /> Back to Studio
      </Button>

      <Card className="border-border/80 shadow-md">
        <CardHeader>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary w-fit">
            <Sparkles className="size-3" /> Author New Curriculum
          </div>
          <CardTitle className="text-xl font-bold">Create New Course</CardTitle>
          <CardDescription>
            Define course metadata, pricing in NGN, and the number of initial free preview lessons.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Course Title
              </Label>
              <Input
                id="title"
                required
                placeholder="e.g. Modern Fullstack Python with Flask & React"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="price" className="text-xs font-semibold">
                  Price ({formData.currency})
                </Label>
                <Input
                  id="price"
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="free_count" className="text-xs font-semibold">
                  Free Preview Lessons Count
                </Label>
                <Input
                  id="free_count"
                  type="number"
                  min="0"
                  max="10"
                  value={formData.free_count}
                  onChange={(e) => setFormData({ ...formData, free_count: e.target.value })}
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold">
                Publish Status
              </Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'DRAFT' | 'PUBLISHED' })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="DRAFT">DRAFT (Unpublished - Authoring in progress)</option>
                <option value="PUBLISHED">PUBLISHED (Available in Catalog)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Course Overview & Summary
              </Label>
              <textarea
                id="description"
                rows={4}
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Outline what students will build and master in this course..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 border-t border-border/40 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="text-xs gap-1.5">
              {loading && <Loader2 className="size-3.5 animate-spin" />}
              {loading ? 'Creating...' : 'Save & Build Curriculum'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
