export interface MatchedBook {
  userId: number;
  username: string;
  bookTitle: string;
  bookAuthor: string;
}

export interface Book {
  title: string;
  author: string;
  matches: MatchedBook[];
}

export interface MatchData {
  books: Book[];
}

export interface Match {
  id: number;
  books: Book[];
  status: "pending" | "accepted" | "rejected";
  user: {
    id: number;
    username: string;
  };
  createdAt: string;
}
