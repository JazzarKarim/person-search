// Mainframe migration left some entities with this placeholder founding date, which renders as "December 31, 1".
export const BROKEN_FOUNDING_DATE = '0001-01-01T08:00:00+00:00'

/**
 * Wraps `useBusinessTombstone().setPublicDefault` and shows "Not Available" instead of the
 * incorporation/registration date when the business has the broken migration founding date.
 */
export const useBusinessTombstoneDateFallback = () => {
  const { t } = useI18n()
  const { businessTombstone, setPublicDefault } = useBusinessTombstone()
  const { business } = storeToRefs(useBusinessStore())

  const setPublicDefaultWithDateFallback = async (businessId: string, slim = true): Promise<void> => {
    await setPublicDefault(businessId, slim)

    if (business.value?.foundingDate !== BROKEN_FOUNDING_DATE) {
      return
    }

    // the founding date is always the first side detail (incorporation or registration date)
    const [foundingDateDetail, ...rest] = businessTombstone.value.sideDetails ?? []
    if (foundingDateDetail) {
      businessTombstone.value.sideDetails = [
        { ...foundingDateDetail, value: t('label.notAvailable') },
        ...rest
      ]
    }
  }

  return { setPublicDefaultWithDateFallback }
}
