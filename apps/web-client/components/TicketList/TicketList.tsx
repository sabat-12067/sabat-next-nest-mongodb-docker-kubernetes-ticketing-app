import Link from 'next/link';
import { Table } from '@mantine/core';
import { Ticket } from '../../interfaces';

interface Props {
  tickets: Ticket[];
}

const TicketList = ({ tickets }: Props) => {
  const rows = tickets.map((ticket) => {
    return (
      <Table.Tr key={ticket.id}>
        <Table.Td>{ticket.title}</Table.Td>
        <Table.Td>{ticket.price}</Table.Td>
        <Table.Td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
          </Link>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <div>
      <h1>Tickets</h1>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Price</Table.Th>
            <Table.Th>Link</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </div>
  );
};

export default TicketList;
