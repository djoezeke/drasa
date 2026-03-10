const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    role: 'student' | 'teacher' | 'admin';
    bio: string;
    avatar: string;
    created_at: string;
    updated_at: string;
}

export interface Course {
    id: number;
    title: string;
    code: string;
    description: string;
    instructor: User;
    instructor_name?: string;
    status: 'draft' | 'published' | 'archived';
    start_date: string;
    end_date: string;
    syllabus?: string;
    cover_image: string;
    enrollment_count?: number;
    is_enrolled?: boolean;
    modules?: Module[];
    created_at: string;
    updated_at?: string;
}

export interface Module {
    id: number;
    course: number;
    title: string;
    description: string;
    order: number;
    is_published: boolean;
    assignments?: Assignment[];
    created_at: string;
    updated_at: string;
}

export interface Assignment {
    id: number;
    module: number;
    module_title?: string;
    course_code?: string;
    title: string;
    description: string;
    submission_type: 'online_text' | 'file_upload' | 'url';
    points_possible: number;
    due_date: string;
    available_from: string;
    available_until?: string;
    is_published: boolean;
    allow_late_submission: boolean;
    submission_status?: {
        submitted: boolean;
        status?: string;
        submitted_at?: string;
        has_grade?: boolean;
    };
    created_at: string;
    updated_at: string;
}

export interface Submission {
    id: number;
    assignment: Assignment;
    assignment_id?: number;
    student: User;
    content: string;
    file_url: string;
    submitted_at: string;
    status: 'submitted' | 'graded' | 'returned' | 'late';
    attempt_number: number;
    grade_info?: {
        score: number;
        feedback: string;
        graded_at: string;
    };
}

export interface Announcement {
    id: number;
    course: number;
    course_code?: string;
    author: User;
    title: string;
    content: string;
    is_pinned: boolean;
    created_at: string;
    updated_at: string;
}

export interface Discussion {
    id: number;
    course: number;
    course_code?: string;
    author: User;
    title: string;
    content: string;
    is_pinned: boolean;
    is_locked: boolean;
    comments_count?: number;
    top_level_comments?: Comment[];
    created_at: string;
    updated_at: string;
}

export interface Comment {
    id: number;
    discussion: number;
    author: User;
    content: string;
    parent?: number;
    replies?: Comment[];
    created_at: string;
    updated_at: string;
}

class APIClient {
    private baseURL: string;

    constructor(baseURL: string = API_BASE_URL) {
        this.baseURL = baseURL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseURL}${endpoint}`;
        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        };

        const response = await fetch(url, config);

        if (!response.ok) {
            const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
            throw new Error(error.detail || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    // User endpoints
    async getCurrentUser(): Promise<User> {
        return this.request<User>('/users/me/');
    }

    async getUser(id: number): Promise<User> {
        return this.request<User>(`/users/${id}/`);
    }

    // Course endpoints
    async getCourses(params?: { enrolled?: boolean }): Promise<{ results: Course[] }> {
        const query = params?.enrolled ? '?enrolled=true' : '';
        return this.request<{ results: Course[] }>(`/courses/${query}`);
    }

    async getCourse(id: number): Promise<Course> {
        return this.request<Course>(`/courses/${id}/`);
    }

    async createCourse(data: Partial<Course>): Promise<Course> {
        return this.request<Course>('/courses/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateCourse(id: number, data: Partial<Course>): Promise<Course> {
        return this.request<Course>(`/courses/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async unenrollFromCourse(id: number): Promise<void> {
        return this.request<void>(`/courses/${id}/unenroll/`, {
            method: 'POST',
        });
    }

    // Module endpoints
    async getModules(courseId?: number): Promise<{ results: Module[] }> {
        const query = courseId ? `?course=${courseId}` : '';
        return this.request<{ results: Module[] }>(`/modules/${query}`);
    }

    async createModule(data: Partial<Module>): Promise<Module> {
        return this.request<Module>('/modules/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Assignment endpoints
    async getAssignments(params?: { course?: number; module?: number }): Promise<{ results: Assignment[] }> {
        const query = new URLSearchParams();
        if (params?.course) query.append('course', params.course.toString());
        if (params?.module) query.append('module', params.module.toString());
        const queryString = query.toString() ? `?${query.toString()}` : '';
        return this.request<{ results: Assignment[] }>(`/assignments/${queryString}`);
    }

    async getAssignment(id: number): Promise<Assignment> {
        return this.request<Assignment>(`/assignments/${id}/`);
    }

    async createAssignment(data: Partial<Assignment>): Promise<Assignment> {
        return this.request<Assignment>('/assignments/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Submission endpoints
    async getSubmissions(assignmentId?: number): Promise<{ results: Submission[] }> {
        const query = assignmentId ? `?assignment=${assignmentId}` : '';
        return this.request<{ results: Submission[] }>(`/submissions/${query}`);
    }

    async createSubmission(data: Partial<Submission>): Promise<Submission> {
        return this.request<Submission>('/submissions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Announcement endpoints
    async getAnnouncements(courseId?: number): Promise<{ results: Announcement[] }> {
        const query = courseId ? `?course=${courseId}` : '';
        return this.request<{ results: Announcement[] }>(`/announcements/${query}`);
    }

    async createAnnouncement(data: Partial<Announcement>): Promise<Announcement> {
        return this.request<Announcement>('/announcements/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Discussion endpoints
    async getDiscussions(courseId?: number): Promise<{ results: Discussion[] }> {
        const query = courseId ? `?course=${courseId}` : '';
        return this.request<{ results: Discussion[] }>(`/discussions/${query}`);
    }

    async getDiscussion(id: number): Promise<Discussion> {
        return this.request<Discussion>(`/discussions/${id}/`);
    }

    async createDiscussion(data: Partial<Discussion>): Promise<Discussion> {
        return this.request<Discussion>('/discussions/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    // Comment endpoints
    async createComment(data: Partial<Comment>): Promise<Comment> {
        return this.request<Comment>('/comments/', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }
}

export const apiClient = new APIClient();
