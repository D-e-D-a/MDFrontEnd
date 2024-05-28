import axios from 'axios';
import { RegisterResponseProps, User, votesProps } from './types';
import { title } from 'process';

export const baseUrl = 'http://localhost:8000/api';

export async function registerUser(userDetails: User) {
  try {
    const response = await axios.post(`${baseUrl}/auth/register`, userDetails);
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function loginUser(username: string, password: string) {
  try {
    const response: RegisterResponseProps = await axios.post(`${baseUrl}/auth/login`, {
      username: username,
      password: password,
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getUserDetails(id: number, token: string) {
  try {
    const response = await axios.get(`${baseUrl}/auth/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token})}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

//======================================================================================================================

export async function getSession(token: string) {
  try {
    if (token) {
      const response = await axios.get(`${baseUrl}/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function createSession(token: string, sessionName: string) {
  try {
    if (token) {
      const response = await axios.post(
        `${baseUrl}/sessions`,
        {
          title: sessionName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateSession(token: string, sessionId: string, sessionName: string) {
  try {
    if (token) {
      const response = await axios.patch(
        `${baseUrl}/sessions/${sessionId}`,
        {
          title: sessionName,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function deleteSession(token: string, sessionId: string) {
  try {
    if (token) {
      await axios.delete(`${baseUrl}/sessions/${sessionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

//======================================================================================================================

export async function sendVotes(token: string, votes: votesProps) {
  try {
    if (token) {
      const response = await axios.post(`${baseUrl}/vote`, votes, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

//======================================================================================================================

export async function sendComment(token: string, id: number | undefined, comment: string) {
  try {
    if (token) {
      const response = await axios.post(
        `${baseUrl}/question/${id}/comments`,
        {
          text: comment,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response;
    }
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

//======================================================================================================================

export const sendQuestion = async (
  token: string,
  title: string,
  sessionId: string,
  file?: File,
) => {
  try {
    // Create FormData object
    const formData = new FormData();
    formData.append('title', title);
    formData.append('sessionId', sessionId);
    if (file) {
      formData.append('file', file);
    }

    // Send POST request using Axios
    const response = await axios.post('http://localhost:8000/api/question', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const updateQuestion = async (token: string, id: string, title: string) => {
  console.log('🚀 ~ updateQuestion ~ token: string, id: string, title: string:', token, id, title);
  try {
    const response = await axios.patch(
      `${baseUrl}/question/${id}`,
      {
        title: title,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteQuestion = async (token: string, id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/question/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

//======================================================================================================================

export const updateUser = async (
  token: string,
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  role: string,
) => {
  console.log("🚀 ~ token:", token,role,firstName,lastName,email)
  try {
    const response = await axios.patch(
      `${baseUrl}/user/${id}`,
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
export const updateUserPassword = async (
  token: string,
  id: string,
  oldPassword: string,
  password: string,
) => {
  try {
    const response = await axios.patch(
      `${baseUrl}/user/user-password/${id}`,

      {
        currentPassword: oldPassword,
        newPassword: password,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getUsers = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const deleteUser = async (token: string, id: string) => {
  try {
    const response = await axios.delete(`${baseUrl}/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('🚀 ~ deleteUser ~ response:', response);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
