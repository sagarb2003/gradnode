import type { Student } from '@/api/students'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type StudentAvatarProps = {
  student: Pick<Student, 'firstName' | 'lastName' | 'image'>
  className?: string
}

export default function StudentAvatar({
  student,
  className,
}: StudentAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarImage src={student.image} alt="" />
      <AvatarFallback>
        {student.firstName[0]}
        {student.lastName[0]}
      </AvatarFallback>
    </Avatar>
  )
}
