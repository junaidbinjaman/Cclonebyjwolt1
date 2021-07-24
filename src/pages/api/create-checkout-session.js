const stripe = require('stripe')('sk_test_51GLa1LIIMauOZTYM5RyzDoFvQ6cTQ99bgt3cbAkJ0QMQq53HIQmL1IuHnyLqFqJuE6dDxRaELIXeQN1WeHGgbtlK00OMUZbScY')

export default async (req, res) => {
  const { items, email } = req.body;
  console.log(items, email)

  const transformedItems = items.map(item => ({
    description: item.description,
    quantity: 1,
    price_data: {
      currency: "GBP",
      unit_amount: item.price * 100,
      product_data: {
        name: item.title,
        images: [item.image]
      }
    }
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    shipping_rates: ['shr_1JGeHmIIMauOZTYMc8kVwibZ'],
    shipping_address_collection: {
      allowed_countries: ['GB', 'US', 'CA', 'BD',]
    },
    line_items: transformedItems,
    mode: 'payment',
    success_url: `${process.env.HOST}/success`,
    cancel_url: `${process.env.HOST}/checkout`,
    metadata: {
      email,
      images: JSON.stringify(items.map(item => item.image))
    }
  })
  res.status(200).json({ id: session.id })
}