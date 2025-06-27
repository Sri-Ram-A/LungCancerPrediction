async function handleSubmit(factors: any) {
  const HOST = "localhost:8000";
  const BASE_API_URL = `http://${HOST}/api/`;

  try {
    const response = await fetch(BASE_API_URL, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(factors),
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    if (error instanceof Error) console.error(error.message);
    throw error;
  }
}

export default handleSubmit;
