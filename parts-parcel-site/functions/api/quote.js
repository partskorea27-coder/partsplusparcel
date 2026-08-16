export async function onRequestPost(context) {
  const formData = await context.request.formData();

  const firstName = formData.get("first_name") || "";
  const lastName = formData.get("last_name") || "";
  const company = formData.get("company_name") || "";
  const phone = formData.get("phone") || "";
  const email = formData.get("email") || "";
  const vehicle = formData.get("vehicle_brand") || "";
  const parts = formData.get("required_parts") || "";
  const message = formData.get("message") || "";

  const subject = `New Quote Request - ${firstName} ${lastName}`;

  const body = `
NEW QUOTE REQUEST

Name: ${firstName} ${lastName}
Company: ${company}
Phone: ${phone}
Email: ${email}
Vehicle Brand: ${vehicle}
Required Part(s): ${parts}

Message:
${message}
  `.trim();

  // Temporary response while we connect Cloudflare Email Service
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain"
    }
  });
}
