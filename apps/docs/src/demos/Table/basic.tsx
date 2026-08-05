import { Table, type TableColumn } from "@jeon-ji/common-ui";

interface Order {
  id: string;
  product: string;
  quantity: number;
  status: string;
}

const orders: Order[] = [
  { id: "ord-1", product: "무선 키보드", quantity: 2, status: "배송 완료" },
  { id: "ord-2", product: "27인치 모니터", quantity: 1, status: "배송 중" },
  { id: "ord-3", product: "USB-C 허브", quantity: 4, status: "결제 완료" },
];

// render는 필수다 — 컬럼 key와 데이터 필드가 묶이지 않아 파생 컬럼을 자유롭게 만든다
const columns: TableColumn<Order>[] = [
  { key: "product", header: "상품", render: (row) => row.product },
  { key: "quantity", header: "수량", align: "right", render: (row) => `${String(row.quantity)}개` },
  { key: "status", header: "상태", render: (row) => row.status },
];

export default function BasicDemo() {
  return <Table caption="주문 목록" columns={columns} rows={orders} rowKey={(row) => row.id} />;
}
