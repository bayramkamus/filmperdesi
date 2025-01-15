import axios from "axios";

const API_KEY = "AIzaSyAu1bDAOaanOyb6jYLS-yje3UQVXAsgNgA";
const BASE_URL = "https://www.googleapis.com/books/v1";

export const searchBooks = async (query, maxResults = 10) => {
  try {
    const response = await axios.get(`${BASE_URL}/volumes`, {
      params: {
        q: query,
        key: API_KEY,
        maxResults,
        langRestrict: "tr", // Türkçe kitaplar için
        orderBy: "relevance",
        printType: "books",
      },
    });

    return response.data.items.map((book) => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors || [],
      thumbnail: book.volumeInfo.imageLinks?.thumbnail || "",
      description: book.volumeInfo.description || "",
      categories: book.volumeInfo.categories || [],
      publishedDate: book.volumeInfo.publishedDate,
      pageCount: book.volumeInfo.pageCount,
      language: book.volumeInfo.language,
    }));
  } catch (error) {
    console.error("Kitap arama hatası:", error);
    throw error;
  }
};
