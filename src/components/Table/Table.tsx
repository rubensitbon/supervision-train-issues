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

interface MyData {
  trainId: number;
  trainX: number;
  trainY: number;
  batteryTension: number;
  railTension: number;
  errorBit: string;
  mesureDate: number;
  label: string;
  updateDate: number;
}

function createMyData(
  trainId: number,
  trainX: number,
  trainY: number,
  batteryTension: number,
  railTension: number,
  errorBit: string,
  mesureDate: number,
  label: string,
  updateDate: number
): MyData {
  return {
    trainId,
    trainX,
    trainY,
    batteryTension,
    railTension,
    errorBit,
    mesureDate,
    label,
    updateDate
  };
}

const myRows = [
  createMyData(1, 0, 0, 12, 12, 'false', 1581308213, 'undefined', 0),
  createMyData(2, 2, 2, 12, 12, 'false', 1581308313, 'undefined', 0),
  createMyData(3, 3, 3, 12, 0, 'true', 1581308413, 'undefined', 0),
  createMyData(4, 4, 4, 12, 0, 'true', 1581308513, 'rail', 1581408213),
  createMyData(5, 5, 5, 0, 12, 'true', 1581308613, 'train', 1581409213),
  createMyData(6, 6, 6, 12, 12, 'false', 1581308713, 'undefined', 0)
];

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
    id: 'trainId',
    numeric: true,
    disablePadding: false,
    label: 'Identifiant'
  },
  {
    id: 'trainX',
    numeric: true,
    disablePadding: false,
    label: 'Position X'
  },

  {
    id: 'trainY',
    numeric: true,
    disablePadding: false,
    label: 'Position Y'
  },
  {
    id: 'batteryTension',
    numeric: true,
    disablePadding: false,
    label: 'Tension Batterie'
  },
  {
    id: 'railTension',
    numeric: true,
    disablePadding: false,
    label: 'Tension rail'
  },
  {
    id: 'errorBit',
    numeric: false,
    disablePadding: false,
    label: "Bit d'erreur"
  },
  {
    id: 'mesureDate',
    numeric: true,
    disablePadding: false,
    label: 'Date Mesure'
  },
  { id: 'label', numeric: false, disablePadding: false, label: 'Label' },
  {
    id: 'updateDate',
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
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected, handleFilter, isFilter, update, setUpdate } = props;

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
            <IconButton aria-label="delete">
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

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof MyData>('trainId');
  const [selected, setSelected] = React.useState<number[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState(
    myRows.filter(row => row.errorBit === 'true')
  );
  const [isFilter, setIsFilter] = React.useState(true);
  const [update, setUpdate] = React.useState('undefined');

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
      const newSelecteds = rows.map(n => n.trainId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, trainId: number) => {
    const selectedIndex = selected.indexOf(trainId);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, trainId);
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
      ? setRows(myRows)
      : setRows(myRows.filter(row => row.errorBit === 'true'));
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

  const isSelected = (trainId: number) => selected.indexOf(trainId) !== -1;

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
                  const isItemSelected = isSelected(row.trainId);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={event => handleClick(event, row.trainId)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.trainId}
                      selected={isItemSelected}
                      style={{
                        backgroundColor:
                          row.updateDate === 0 && row.errorBit === 'true'
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
                        Train n°{row.trainId}
                      </TableCell>
                      <TableCell align="right">{row.trainX}</TableCell>
                      <TableCell align="right">{row.trainY}</TableCell>
                      <TableCell align="right">{row.batteryTension}</TableCell>
                      <TableCell align="right">{row.railTension}</TableCell>
                      <TableCell align="right">{row.errorBit}</TableCell>
                      <TableCell align="right">{row.mesureDate}</TableCell>
                      <TableCell align="right">{row.label}</TableCell>
                      <TableCell align="right">{row.updateDate}</TableCell>
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
