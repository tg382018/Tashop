import getProducts from "./actions/get-products";
import Product from "./product";

export default async function Products() {
  const products = await getProducts();

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div key={product.id}>
          <Product product={product} />
        </div>
      ))}
    </div>
  );
}