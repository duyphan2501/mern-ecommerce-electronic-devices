export default function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Chuyển đ -> d trước khi xử lý các dấu khác
    .replace(/đ/g, 'd') 
    // Tách các ký tự có dấu (ví dụ: á -> a + ´)
    .normalize('NFD') 
    // Xóa các dấu đã tách ra
    .replace(/[\u0300-\u036f]/g, '') 
    // Thay thế ký tự không hợp lệ bằng khoảng trắng
    .replace(/[^a-z0-9\s-]/g, ' ') 
    // Thay khoảng trắng/gạch ngang liên tiếp bằng 1 gạch ngang
    .replace(/[\s-]+/g, '-') 
    // Xóa gạch ngang ở đầu và cuối
    .replace(/^-+|-+$/g, '');
}
