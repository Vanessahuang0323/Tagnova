import { StudentProfile } from '../types/user';

interface ParsedResume {
  education: StudentProfile['education'];
  experience: StudentProfile['experience'];
  skills: StudentProfile['skills'];
}

export const parseResume = async (file: File): Promise<ParsedResume> => {
  // 这里我们模拟简历解析过程
  // 在实际应用中，您可能需要使用专业的简历解析 API 或服务
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        education: {
          school: "示例大学",
          major: "计算机科学",
          graduationYear: 2024,
          gpa: 3.8
        },
        experience: [
          {
            title: "软件工程师实习生",
            company: "示例科技公司",
            startDate: "2023-06",
            endDate: "2023-09",
            description: "参与开发公司核心产品，负责前端界面实现和性能优化。"
          }
        ],
        skills: {
          technical: ["JavaScript", "React", "TypeScript", "Node.js"],
          soft: ["团队协作", "问题解决", "沟通能力"]
        }
      });
    }, 2000);
  });
};

export const validateResume = (file: File): boolean => {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return validTypes.includes(file.type) && file.size <= maxSize;
}; 