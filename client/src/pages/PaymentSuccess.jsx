
const PaymentSuccess = () => {
  return (
    <div className="my-10 flex flex-col items-center justify-center">
      <h2 className="text-3xl font-semibold mb-4 text-green-600">Payment Successful!</h2>
      <p className="text-lg">Thank you for your purchase. Your payment has been
        processed successfully.</p>
      <p className="mt-2">You will receive a confirmation email shortly.</p>
      <div className="mt-6">
        <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Go to Home</a>
      </div>

    </div>
  )
}

export default PaymentSuccess