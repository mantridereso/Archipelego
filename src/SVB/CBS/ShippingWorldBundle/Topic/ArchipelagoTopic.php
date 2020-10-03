<?php
namespace SVB\CBS\ShippingWorldBundle\Topic;

use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use HireVoice\Neo4j\EntityManager;
use HireVoice\Neo4j\Repository;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use SVB\CBS\ShippingWorldBundle\Model\WorldInterface;

/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 10.10.15
 * Time: 15:36
 */
class ArchipelagoTopic implements TopicInterface
{

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var Repository
     */
    private $worldRepository;

    public function __construct(EntityManager $entityManager){
        $this->em = $entityManager;
        $this->worldRepository = $entityManager->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\World');
    }

    /**
     * @param  ConnectionInterface $connection
     * @param  Topic $topic
     * @param  WampRequest $request
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {

        if ($request->getRouteName() === 'archipelago_topic_user_ingame_world'){

            $event = $request->getAttributes()->get('event');

            if ($event === 'origin'){

                $worldName = $request->getAttributes()->get("world");

                /**
                 * @var WorldInterface $world
                 */
                $world = $this->worldRepository->findOneByName($worldName);

                if ($world) {
                    $connection->event($topic->getId(), ['world' => $world->export()]);
                }
            }

        }


    }

    /**
     * @param  ConnectionInterface $connection
     * @param  Topic $topic
     * @param WampRequest $request
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        $topic->broadcast(['msg' => $connection->resourceId . " has left " . $topic->getId()]);
    }

    /**
     * @param  ConnectionInterface $connection
     * @param  Topic $topic
     * @param WampRequest $request
     * @param $event
     * @param  array $exclude
     * @param  array $eligible
     */
    public function onPublish(ConnectionInterface $connection, Topic $topic, WampRequest $request, $event, array $exclude, array $eligible)
    {
/*        $topic->broadcast([
            'msg' => $event
        ]);*/

    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'archipelago.topic';
    }
}