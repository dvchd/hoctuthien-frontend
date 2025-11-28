
import { User, UserRole } from '../types';

export const MENTEES_DATA: User[] = [
  {
    id: 'u1',
    name: 'Phạm Văn Học',
    email: 'hoc@test.com',
    role: UserRole.MENTEE,
    isActivated: true,
    avatarUrl: 'https://picsum.photos/seed/u1/200',
    bio: 'Sinh viên năm cuối ĐH Bách Khoa. Đam mê lập trình và hoạt động xã hội.',
    rating: 0,
    reviewCount: 0
  },
  {
    id: 'u2',
    name: 'Hoàng Thị Chăm',
    email: 'cham@test.com',
    role: UserRole.MENTEE,
    isActivated: true,
    avatarUrl: 'https://picsum.photos/seed/u2/200',
    bio: 'Nhân viên văn phòng muốn học thêm tiếng Anh và kỹ năng mềm.',
    rating: 0,
    reviewCount: 0
  },
  {
    id: 'u3',
    name: 'Lê Tuấn Tú',
    email: 'tu@test.com',
    role: UserRole.MENTEE,
    isActivated: true,
    avatarUrl: 'https://picsum.photos/seed/u3/200',
    bio: 'Designer Freelancer. Muốn tìm hiểu về đầu tư tài chính.',
    rating: 0,
    reviewCount: 0
  },
  {
    id: 'u4',
    name: 'Ngô Bảo Châu',
    email: 'chau@test.com',
    role: UserRole.MENTEE,
    isActivated: true,
    avatarUrl: 'https://picsum.photos/seed/u4/200',
    rating: 0,
    reviewCount: 0
  },
  {
    id: 'u5',
    name: 'Vũ Minh Hiếu',
    email: 'hieu@test.com',
    role: UserRole.MENTEE,
    isActivated: true,
    avatarUrl: 'https://picsum.photos/seed/u5/200',
    rating: 0,
    reviewCount: 0
  },
  { id: 'u6', name: 'Đinh Thị Mai', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u6/200', email: 'u6@test.com' },
  { id: 'u7', name: 'Trịnh Văn Nam', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u7/200', email: 'u7@test.com' },
  { id: 'u8', name: 'Lý Thị Lan', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u8/200', email: 'u8@test.com' },
  { id: 'u9', name: 'Cao Văn Dũng', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u9/200', email: 'u9@test.com' },
  { id: 'u10', name: 'Bạch Thị Tuyết', role: UserRole.MENTEE, isActivated: true, avatarUrl: 'https://picsum.photos/seed/u10/200', email: 'u10@test.com' }
];
