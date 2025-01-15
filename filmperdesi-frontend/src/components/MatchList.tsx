import React, { useEffect, useState } from "react";
import { listMatches } from "../services/matchService";
import { Match } from "../types/match";
import { useAuth } from "../contexts/AuthContext";
import "./MatchList.css";

const MatchList: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (token) {
        try {
          const matchList = await listMatches(token);
          setMatches(matchList);
        } catch (error) {
          console.error("Eşleşmeler yüklenirken hata:", error);
        }
      }
    };
    fetchMatches();
  }, [token]);

  return (
    <div className="match-list-container">
      <h2>Eşleşmeler</h2>
      {matches.map((match) => (
        <div key={match.id} className="match-card">
          <div className="match-header">
            <h3>Eşleşme #{match.id}</h3>
            <span className={`status status-${match.status}`}>
              {match.status === "pending" && "Bekliyor"}
              {match.status === "accepted" && "Kabul Edildi"}
              {match.status === "rejected" && "Reddedildi"}
            </span>
          </div>
          <div className="books-container">
            {match.books.map((book, index) => (
              <div key={index} className="book-card">
                <div className="book-info">
                  <h4>{book.title}</h4>
                  <p>Yazar: {book.author}</p>
                </div>
                {book.matches && book.matches.length > 0 && (
                  <div className="matched-books">
                    <h5>Eşleşen Kitaplar:</h5>
                    {book.matches.map((matchedBook, idx) => (
                      <div key={idx} className="matched-book">
                        <p className="username">{matchedBook.username}</p>
                        <p>{matchedBook.bookTitle}</p>
                        <p className="author">{matchedBook.bookAuthor}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="match-footer">
            <span className="created-at">
              {new Date(match.createdAt).toLocaleDateString("tr-TR")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchList;
