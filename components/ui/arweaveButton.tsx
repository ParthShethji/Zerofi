import { ArAccount, ArProfile } from 'arweave-account'

const account = new ArAccount()

const onSuccess = async (response: any) => {
    console.log({ response });
  };
  