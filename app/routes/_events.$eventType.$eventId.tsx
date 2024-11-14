import type { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { getEventById } from '~/db/eventStorage.server';
import Modal from '~/ui/Modal';
import EventContent from '~/ui/EventContent';
import invariant from 'tiny-invariant';

export const loader = async ({ params }: LoaderFunctionArgs) => {
    invariant(params.eventId, 'Expected params.eventId');
    const event = await getEventById(params.eventId);
    if (!event) throw new Response('Event Not Found', { status: 404 });
    return { event };
};

export default function EventModalRoute() {
    const { event } = useLoaderData<typeof loader>();
    const navigate = useNavigate();

    const closeModal = () => {
        navigate(-1);
    };

    return (
        <Modal isOpen={true} onClose={closeModal}>
            <EventContent event={event} />
        </Modal>
    );
}
