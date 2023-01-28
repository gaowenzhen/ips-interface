import { useSnackbar, SnackbarMessage, OptionsObject } from 'notistack';

export default function useIpsTips() {
	const { enqueueSnackbar } = useSnackbar();

	return enqueueSnackbar
}
