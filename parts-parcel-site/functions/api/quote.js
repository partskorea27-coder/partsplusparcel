export async function onRequestPost(context) {
  try {
    const contentType = context.request.headers.get("content-type") || "";

    let data = {};

    if (contentType.includes("application/json")) {
      data = await context.request.json();
    } else {
      const formData = await context.request.formData();

      data = {
        firstName: formData.get("firstName") || "",
        lastName: formData.get("lastName") || "",
        company: formData.get("company") || "",
        phone: formData.get("phone") || "",
        email: formData.get("email") || "",
        vehicle: formData.get("vehicle") || "",
        parts: formData.get("parts") || "",
        message: formData.get("message") || ""
      };
    }

    const firstName = data.firstName || "";
    const lastName = data.lastName || "";
    const company = data.company || "";
    const phone = data.phone || "";
    const email = data.email || "";
    const vehicle = data.vehicle || "";
    const parts = data.parts || "";
    const message = data.message || "";

    if (!firstName || !lastName || !phone || !email || !vehicle || !parts) {
      return Response.json(
        {
          success: false,
          error: "Please fill in all required fields."
        },
        { status: 400 }
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

          <hr>

          <p>This enquiry was submitted through partsplusparcel.com.</p>
        `
      })
    });

    const result = await response.text();

    if (!response.ok) {
      console.error("Resend error:", result);

      return Response.json(
        {
          success: false,
          error: "Unable to send email."
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true
    });

  } catch (error) {
    console.error("Server error:", error);

    return Response.json(
      {
        success: false,
        error: "Something went wrong."
      },
      { status: 500 }
    );
  }
}
