// DummyJSON has no courses or assignments, so the student portal uses this
// static demo data. Everything else in the portal comes from the API.

export const enrolledProgram = {
  name: 'BSc Computer Science',
  year: 'Year 2',
  academicYear: '2026/27',
  advisor: 'Dr. Sarah Lee',
}

export type Course = {
  code: string
  title: string
  instructor: string
  credits: number
  progress: number // percent complete
}

export const courses: Course[] = [
  {
    code: 'CS201',
    title: 'Data Structures & Algorithms',
    instructor: 'Dr. Alan Brooks',
    credits: 4,
    progress: 65,
  },
  {
    code: 'CS210',
    title: 'Web Development',
    instructor: 'Prof. Maria Chen',
    credits: 3,
    progress: 80,
  },
  {
    code: 'CS220',
    title: 'Databases',
    instructor: 'Dr. James Patel',
    credits: 3,
    progress: 40,
  },
  {
    code: 'MA205',
    title: 'Discrete Mathematics',
    instructor: 'Dr. Nina Okafor',
    credits: 3,
    progress: 55,
  },
]

export type AssignmentStatus = 'submitted' | 'pending' | 'overdue'

export type Assignment = {
  id: number
  title: string
  courseCode: string
  dueDate: string
  status: AssignmentStatus
}

export const assignments: Assignment[] = [
  {
    id: 1,
    title: 'Binary search tree implementation',
    courseCode: 'CS201',
    dueDate: '2026-10-10',
    status: 'pending',
  },
  {
    id: 2,
    title: 'Responsive portfolio page',
    courseCode: 'CS210',
    dueDate: '2026-10-06',
    status: 'pending',
  },
  {
    id: 3,
    title: 'ER diagram for a library system',
    courseCode: 'CS220',
    dueDate: '2026-09-28',
    status: 'overdue',
  },
  {
    id: 4,
    title: 'Proofs by induction worksheet',
    courseCode: 'MA205',
    dueDate: '2026-09-25',
    status: 'submitted',
  },
  {
    id: 5,
    title: 'Sorting algorithms report',
    courseCode: 'CS201',
    dueDate: '2026-09-20',
    status: 'submitted',
  },
]
