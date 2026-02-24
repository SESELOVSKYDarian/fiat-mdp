export function mapRaffle(raffle) {
  return {
    id: raffle.id,
    title: raffle.title,
    prize: raffle.prize,
    participationDeadline: raffle.participationDeadline.toISOString(),
    resultDate: raffle.resultDate.toISOString(),
    status: raffle.status,
    winnerUserId: raffle.winnerUserId || null,
    winnerUserName: raffle.winnerUser?.fullName || null,
    createdAt: raffle.createdAt.toISOString(),
    updatedAt: raffle.updatedAt.toISOString()
  };
}

export function mapParticipation(item) {
  return {
    id: item.id,
    raffleId: item.raffleId,
    userId: item.userId,
    reason: item.reason,
    hasFiatGiama: item.hasFiatGiama,
    plate: item.plate,
    validationStatus: item.validationStatus,
    createdAt: item.createdAt.toISOString(),
    userName: item.user?.fullName || null,
    userEmail: item.user?.email || null,
    raffleTitle: item.raffle?.title || null
  };
}
