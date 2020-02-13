import React from 'react';
import clsx from 'clsx';
import {
  createStyles,
  lighten,
  makeStyles,
  Theme
} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import SendIcon from '@material-ui/icons/Send';
import FilterListIcon from '@material-ui/icons/FilterList';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import api from '../../utils/api';

interface MyData {
  id: number;
  train: number;
  X: number;
  Y: number;
  num_canton: number;
  battery_voltage: number;
  rail_voltage: number;
  error_bit: number;
  time_sec: number;
  time_usec: number;
  label: string;
  check_time: number;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof MyData;
  label: string;
  numeric: boolean;
}

const myHeadCells: HeadCell[] = [
  {
    id: 'train',
    numeric: true,
    disablePadding: false,
    label: 'Identifiant'
  },
  // {
  //   id: 'X',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Position X'
  // },
  // {
  //   id: 'Y',
  //   numeric: true,
  //   disablePadding: false,
  //   label: 'Position Y'
  // },
  {
    id: 'num_canton',
    numeric: true,
    disablePadding: false,
    label: 'Canton'
  },
  {
    id: 'battery_voltage',
    numeric: true,
    disablePadding: false,
    label: 'Tension Batterie'
  },
  {
    id: 'rail_voltage',
    numeric: true,
    disablePadding: false,
    label: 'Tension rail'
  },
  {
    id: 'error_bit',
    numeric: false,
    disablePadding: false,
    label: "Bit d'erreur"
  },
  {
    id: 'time_sec',
    numeric: true,
    disablePadding: false,
    label: 'Date Mesure'
  },
  {
    id: 'time_usec',
    numeric: true,
    disablePadding: false,
    label: 'Date usec Mesure'
  },
  { id: 'label', numeric: false, disablePadding: false, label: 'Label' },
  {
    id: 'check_time',
    numeric: true,
    disablePadding: false,
    label: 'Date labelisation'
  }
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof MyData
  ) => void;
  onSelectAllClick: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort
  } = props;
  const createSortHandler = (property: keyof MyData) => (
    event: React.MouseEvent<unknown>
  ) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {myHeadCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1)
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: theme.palette.secondary.main,
            backgroundColor: lighten(theme.palette.secondary.light, 0.85)
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark
          },
    title: {
      flex: '1 1 100%'
    }
  })
);

const updateList = [
  {
    value: 'undefined',
    label: 'Undefined'
  },
  {
    value: 'train',
    label: 'Train'
  },
  {
    value: 'rail',
    label: 'Rail'
  },
  {
    value: 'clear',
    label: 'Clear'
  }
];

interface EnhancedTableToolbarProps {
  numSelected: number;
  handleFilter: () => void;
  isFilter: boolean;
  update: string;
  setUpdate: (value: string) => void;
  handleSubmitUpdate: () => void;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    handleFilter,
    isFilter,
    update,
    setUpdate,
    handleSubmitUpdate
  } = props;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUpdate(event.target.value);
  };

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} sélections
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle">
          Données du train
        </Typography>
      )}
      {numSelected > 0 ? (
        <>
          <TextField
            select
            label="Label"
            value={update}
            onChange={handleChange}
            helperText="Select the Label"
            style={{ width: '300px', marginRight: '15px' }}
          >
            {updateList.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Tooltip title="Delete">
            <IconButton onClick={handleSubmitUpdate} aria-label="delete">
              <SendIcon />
            </IconButton>
          </Tooltip>
        </>
      ) : (
        <Tooltip title="Filter list">
          <IconButton
            onClick={handleFilter}
            color={isFilter ? 'primary' : 'secondary'}
            aria-label="filter list"
          >
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%'
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1
    }
  })
);

interface props {
  ip: string;
  port: string;
}

export default function EnhancedTable({ ip, port }: props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof MyData>('train');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [data, setData] = React.useState<MyData[]>([]);
  const [rows, setRows] = React.useState(data);
  const [isFilter, setIsFilter] = React.useState(true);
  const [update, setUpdate] = React.useState('undefined');

  React.useEffect(() => {
    api.get(`http://${ip}:${port}/fetch`).then(result => {
      setData(result.data);
      isFilter
        ? setRows(result.data.filter((row: MyData) => row.error_bit === 1))
        : setRows(result.data);
    });
  }, [isFilter]);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof MyData
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows && rows.map((n: MyData) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleFilter = () => {
    isFilter
      ? setRows(data)
      : setRows(data.filter((row: MyData) => row.error_bit === 1));
    setIsFilter(!isFilter);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSubmitUpdate = () => {
    const intermediaryRows = data;
    const rowsToUpdate: any[] = [];

    intermediaryRows.forEach((intermediaryRow: MyData) => {
      if (selected.includes(intermediaryRow.id)) {
        intermediaryRow.label = update;
        rowsToUpdate.push(intermediaryRow);
      }
    });

    isFilter
      ? setRows(intermediaryRows.filter((row: MyData) => row.error_bit === 1))
      : setRows(intermediaryRows);

    setSelected([]);

    api
      .post(`http://${ip}:${port}/fetch`, rowsToUpdate)
      .then(function(response) {
        console.log(response);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          handleFilter={handleFilter}
          isFilter={isFilter}
          update={update}
          setUpdate={setUpdate}
          handleSubmitUpdate={handleSubmitUpdate}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const date_sec = new Date(row.time_sec);
                  console.log('date_sec', date_sec);

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      style={{
                        backgroundColor:
                          row.check_time === 0 && row.error_bit === 1
                            ? 'red'
                            : 'white'
                      }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        Train n°{row.train}
                      </TableCell>
                      {/* <TableCell align="right">{row.X}</TableCell>
                      <TableCell align="right">{row.Y}</TableCell> */}
                      <TableCell align="right">{row.num_canton}</TableCell>
                      <TableCell align="right">{row.battery_voltage}</TableCell>
                      <TableCell align="right">{row.rail_voltage}</TableCell>
                      <TableCell align="right">
                        {row.error_bit === 1 ? 'Erreur' : "Pas d'erreur"}
                      </TableCell>
                      <TableCell align="right">{`${date_sec.getDate()}/${date_sec.getDay()} : ${date_sec.getHours()}:${date_sec.getMinutes()}${date_sec.getSeconds()}`}</TableCell>
                      <TableCell align="right">{row.time_usec}</TableCell>
                      <TableCell align="right">{row.label}</TableCell>
                      <TableCell align="right">{row.check_time}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
