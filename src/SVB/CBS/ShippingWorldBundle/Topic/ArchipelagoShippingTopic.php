<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 19.10.15
 * Time: 15:24
 */

namespace SVB\CBS\ShippingWorldBundle\Topic;


use Gos\Bundle\WebSocketBundle\Router\WampRequest;
use Gos\Bundle\WebSocketBundle\Topic\TopicInterface;
use HireVoice\Neo4j\EntityManager;
use Ratchet\ConnectionInterface;
use Ratchet\Wamp\Topic;
use SVB\CBS\ShippingWorldBundle\Model\ShipInterface;
use SVB\CBS\ShippingWorldBundle\Model\WorldInterface;

class ArchipelagoShippingTopic implements TopicInterface
{

    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var \HireVoice\Neo4j\Repository
     */
    private $worldRepository;

    /**
     * @var \HireVoice\Neo4j\Repository
     */
    private $shipRepository;

    public function __construct(EntityManager $entityManager){
        $this->em = $entityManager;
        $this->worldRepository = $entityManager->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\World');
        $this->shipRepository = $entityManager->getRepository('SVB\\CBS\\ShippingWorldBundle\\Model\\Ship');
    }


    /**
     * @param  ConnectionInterface $connection
     * @param  Topic $topic
     * @param WampRequest $request
     */
    public function onSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        switch ($request->getRouteName()){

            case 'archipelago_topic_user_ingame_world_shipping_ships':

                $t0 = microtime(true);

                $worldName = $request->getAttributes()->get("world");
                /**
                 * @var WorldInterface $world
                 */
                $world = $this->worldRepository->findOneByName($worldName);

                if ($world) {

                    $connection->event($topic->getId(), ['shipping' => ['ships' => array_map(function(ShipInterface $ship){
                        return $ship->export();
                    }, $world->getShips()->toArray())]]);

                }

                $t1 = microtime(true);

                echo "archipelago_topic_user_ingame_world_shipping_ships -- > T = ".($t1-$t0)." s";

                break;

            case 'archipelago_topic_user_ingame_world_shipping_ship':
                $t0 = microtime(true);
                $worldName = $request->getAttributes()->get("world");
                $shipName = $request->getAttributes()->get("shipname");

                $ship = $this->shipRepository->findOneByName($shipName);

                if ($ship && ($ship->getWorld()->getName()===$worldName)) {
                    $connection->event($topic->getId(), ['state' => $ship->exportState(new \DateTime())]);

                }
                $t1 = microtime(true);
                echo "archipelago_topic_user_ingame_world_shipping_ship/".$shipName." -- > T = ".($t1-$t0)." s";
                break;

        }
    }

    /**
     * @param  ConnectionInterface $connection
     * @param  Topic $topic
     * @param WampRequest $request
     */
    public function onUnSubscribe(ConnectionInterface $connection, Topic $topic, WampRequest $request)
    {
        // TODO: Implement onUnSubscribe() method.
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
        // TODO: Implement onPublish() method.
    }

    /**
     * @return string
     */
    public function getName()
    {
        return 'archipelago_shipping.topic';
    }
}