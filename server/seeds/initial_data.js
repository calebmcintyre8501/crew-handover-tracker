exports.seed = async function (knex) {
  await knex('acknowledgments').del()
  await knex('updates').del()
  await knex('handovers').del()
  await knex('personnel').del()

  const personnel = await knex('personnel')
    .insert([
      {
        name: 'Tia Morgan',
        rank: 'CIV',
        role: 'Cell Lead',
      },
      {
        name: 'Patrick Martineau',
        rank: 'TSgt',
        role: 'Lead Planner',
      },
      {
        name: 'Caleb McIntyre',
        rank: 'Sgt',
        role: 'Wideband Planner',
      },
      {
        name: 'Christian Connaughton',
        rank: 'TSgt',
        role: 'Wideband Planner',
      },
      {
        name: 'Nathan Howarth',
        rank: 'TSgt',
        role: 'Wideband Planner',
      },
      {
        name: 'Joe Myers',
        rank: 'CTR',
        role: 'Wideband Planner',
      },
    ])
    .returning('*')

  const handovers = await knex('handovers')
    .insert([
      {
        title: 'Mission planning information pending',
        description:
          'Updated planning information is still pending. Continue monitoring for changes.',
        category: 'mission_issue',
        priority: 'high',
        status: 'open',
        created_by: personnel[1].id,
      },
      {
        title: 'Planning system intermittent',
        description:
          'Planning system has been responding slowly and occasionally disconnecting.',
        category: 'system_status',
        priority: 'high',
        status: 'in_progress',
        created_by: personnel[2].id,
      },
      {
        title: 'Upcoming crew training',
        description:
          'Required crew training is scheduled for Wednesday at 0900.',
        category: 'training',
        priority: 'normal',
        status: 'open',
        created_by: personnel[0].id,
      },
      {
        title: 'Planning package requires review',
        description:
          'Planning package requires final review before the upcoming suspense.',
        category: 'priority_task',
        priority: 'high',
        status: 'open',
        created_by: personnel[3].id,
        attention_for: personnel[1].id,
      },
    ])
    .returning('*')

  await knex('updates').insert([
    {
      handover_id: handovers[1].id,
      personnel_id: personnel[2].id,
      message:
        'Initial troubleshooting completed. System issue is still occurring.',
    },
    {
      handover_id: handovers[1].id,
      personnel_id: personnel[4].id,
      message:
        'Issue continues intermittently. Continuing to monitor during shift.',
    },
  ])
}