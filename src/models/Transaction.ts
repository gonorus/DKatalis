export default interface Transaction {
  /**
   * time transaction created
   */
  CreatedDate: Date;
  /**
   * time transaction updated
   */
  UpdatedDate: Date;
  /**
   * balance source account name
   */
  From: string | null;
  /**
   * balance target account name
   */
  To: string | null;
  /**
   * number of balance
   */
  Balanced: number;
  Status: TransactionStatus;
};

export enum TransactionStatus {
  SUCCESS = 'Success',
  PENDING = 'Pending'
};