import AdminNewsEditView from '@/domains/admin/news/edit/AdminNewsEditView';

type PageProps = {
	params: Promise<{ id: string }>;
};

export default async function AdminNewsEditPage({ params }: PageProps) {
	const { id } = await params;
	return <AdminNewsEditView newsId={id} />;
}
