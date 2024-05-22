export interface RegisterResponseProps {
  data: RegisterRootObjectProps;
}
interface RegisterRootObjectProps {
  status: string;
  token: string;
  expireIn: number;
  data: UserDataProps;
}

export interface UserDataProps {
  user: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
//==============================================================================

export interface SessionRootObjectProps {
  status: string;
  data: SessionDataProps;
}

export interface SessionDataProps {
  sessions: Session[];
  pageInfo: PageInfo;
}

interface PageInfo {
  total: number;
  currentPage: number;
  pageSize: number;
}

export interface Session {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface Question {
  id: number;
  title: string;
  sessionId: number;
  documents: Document[];
  votes: any[];
  comments: any[];
}

interface Document {
  id: number;
  fileName: string;
  filePath: string;
  questionId: number;
}


//==============================================================================

export interface votesProps {
  questionId: number;
  choice: string;
}

export interface questionsProps {
  id: number;
  title: string;
  sessionId: number;
  documents: Document[];
  votes: Vote[];
  comments: any[];
}

interface Vote {
  id: number;
  choice: string;
  questionId: number;
  userId: number;
}

interface Document {
  id: number;
  fileName: string;
  filePath: string;
  questionId: number;
}

//==============================================================================
