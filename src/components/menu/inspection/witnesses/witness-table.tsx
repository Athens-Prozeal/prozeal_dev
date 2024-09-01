import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

interface Witness {
  witness_1_date: string ;
  witness_1_name: string;
  witness_1_company: string ;
  witness_1_signature: string;

  witness_2_date: string ;
  witness_2_name: string;
  witness_2_company: string ;
  witness_2_signature: string;

  witness_3_date: string ;
  witness_3_name: string;
  witness_3_company: string ;
  witness_3_signature: string;
}

export default function WitnessTable(witness: Witness) {
  console.log(witness);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>#</strong>
            </TableCell>
            <TableCell>
              <strong>Date</strong>
            </TableCell>
            <TableCell>
              <strong>Name</strong>
            </TableCell>
            <TableCell>
              <strong>Company</strong>
            </TableCell>
            <TableCell>
              <strong>Signature</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>{witness.witness_1_date}</TableCell>
            <TableCell>{witness.witness_1_name}</TableCell>
            <TableCell>{witness.witness_1_company}</TableCell>
            <TableCell>
              <img src={witness.witness_1_signature} alt="" style={{ maxWidth: '250px' }} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>2</TableCell>
            <TableCell>{witness.witness_2_date}</TableCell>
            <TableCell>{witness.witness_2_name}</TableCell>
            <TableCell>{witness.witness_2_company}</TableCell>
            <TableCell>
              <img src={witness.witness_2_signature} alt="" style={{ maxWidth: '250px' }} />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>3</TableCell>
            <TableCell>{witness.witness_3_date}</TableCell>
            <TableCell>{witness.witness_3_name}</TableCell>
            <TableCell>{witness.witness_3_company}</TableCell>
            <TableCell>
              <img src={witness.witness_3_signature} alt="" style={{ maxWidth: '250px' }} />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
