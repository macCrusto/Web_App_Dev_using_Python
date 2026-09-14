import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Eye, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function CourseStudioPage() {
  const navigate = useNavigate();

  const courses = [
    {
      id: 1,
      title: 'Mastering Python Web Development with Flask & React',
      slug: 'mastering-python-web-development',
      status: 'PUBLISHED',
      price: '₦45,000',
      freeCount: 3,
      modulesCount: 5,
      lessonsCount: 26,
      studentsCount: 420,
      revenue: '₦18,900,000',
    },
    {
      id: 2,
      title: 'Fullstack OAuth2 & Google Authentication Masterclass',
      slug: 'fullstack-oauth2-authentication',
      status: 'PUBLISHED',
      price: '₦25,000',
      freeCount: 1,
      modulesCount: 2,
      lessonsCount: 9,
      studentsCount: 290,
      revenue: '₦5,650,000',
    },
    {
      id: 3,
      title: 'FastAPI Microservices with Docker & Redis Queue',
      slug: 'fastapi-microservices-docker',
      status: 'DRAFT',
      price: '₦50,000',
      freeCount: 2,
      modulesCount: 3,
      lessonsCount: 11,
      studentsCount: 0,
      revenue: '₦0',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Layers className="size-6 text-primary" />
            Instructor Course Studio
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your courses, edit modules & lessons, upload video files, and adjust pricing.
          </p>
        </div>
        <Button size="sm" onClick={() => navigate('/instructor/courses/new')}>
          <Plus className="mr-2 size-4" /> Create New Course
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="border-border/70 hover:border-border transition-all shadow-xs">
            <CardContent className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                      course.status === 'PUBLISHED'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {course.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {course.modulesCount} Modules · {course.lessonsCount} Lessons · {course.freeCount} Free Previews
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-base">{course.title}</h3>
                <p className="text-xs text-muted-foreground">Slug: /{course.slug}</p>
              </div>

              <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div>
                  <span>Price:</span>
                  <p className="font-bold text-foreground text-sm">{course.price}</p>
                </div>
                <div>
                  <span>Enrolled:</span>
                  <p className="font-bold text-foreground text-sm">{course.studentsCount}</p>
                </div>
                <div>
                  <span>Gross Revenue:</span>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{course.revenue}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                  onClick={() => navigate(`/instructor/courses/${course.id}/curriculum`)}
                >
                  <Edit className="size-3.5" /> Curriculum Builder
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="size-8 p-0"
                  onClick={() => navigate(`/courses/${course.id}`)}
                  title="View Student Preview"
                >
                  <Eye className="size-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
