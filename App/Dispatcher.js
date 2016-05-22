import QueueDispatcher from 'flux-queue-dispatcher';

var dispatcher = new QueueDispatcher();
export default dispatcher;
export const dispatch = dispatcher.queueDispatch.bind(dispatcher);