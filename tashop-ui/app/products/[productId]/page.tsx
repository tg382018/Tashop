interface SingleProductProps{
    params: Promise<{ productId: string }>;
}

export default async function SingleProduct({params}:SingleProductProps)
{
    const { productId } = await params;
    return <p>
        Single product {productId}
    </p>;
}