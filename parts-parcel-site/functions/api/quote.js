export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();

    const firstName = formData.get("firstName") || "";
    const lastName = formData.get("lastName") || "";
    const company = formData.get("company") || "";
    const phone = formData.get("phone") || "";
    const email = formData.get("email") || "";
    const vehicle = formData.get("vehicle") || "";
    const parts = formData.get("parts") || "";
    const message = formData.get("message") || "";

    if (!firstName || !lastName || !phone || !email || !vehicle || !parts) {
      return new Response(
        JSON.stringify({ success: false, error: "Please fill in all required fields." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${context.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "Parts+Parcel Website <website@partsplusparcel.com>",
        to: ["sales@partsplusparcel.com"],
        reply_to: email,
        subject: `New Quote Request — ${firstName} ${lastName}`,
        html: `
          <h2>New Quote Request</h2>

          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Company:</strong> ${company || "Not provided"}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Vehicle Brand:</strong> ${vehicle}</p>
          <p><strong>Required Part(s):</strong> ${parts}</p>
          <p><strong>Message:</strong></p>
          <p>${message || "No additional message"}</p>
        `
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Resend error:", error);

      return new Response(
        JSON.stringify({ success: false, error: "Unable to send email." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error(error);

    return new Response(
      JSON.stringify({ success: false, error: "Something went wrong." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
